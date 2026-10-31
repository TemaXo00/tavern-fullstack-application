import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { ArticleWhereInput, BlogDatabaseService, TagWhereInput } from '@org/blog-database'
import {
  BlogArticleBySlugOutput,
  BlogArticleListGrpcOutput,
  BlogArticlePaginationGrpcInput,
  BlogTagDetailedOutput,
  BlogTagListGrpcOutput,
  BlogTagOutput,
  BlogTagPaginationGrpcInput,
  CreateBlogArticleInput,
  CreateBlogTagInput,
  PaginatedBlogArticlesOutput,
  PaginatedBlogTagsOutput,
  UpdateBlogArticleInput,
} from '@org/grpc-types'
import { AuthRegisteredMessage } from '@org/rmq-messages'
import { PaginationUtil, StringValidationUtil } from '@org/shared-utils'
import { BLOG_MESSAGES } from '@org/validation-messages'
import Redis from 'ioredis'

import { mapArticleBySlugOutput, mapArticleListOutput, mapDetailedTagOutput } from './helpers/map-response'
import {
  BLOG_ARTICLE_BY_SLUG_SELECTIONS,
  BLOG_ARTICLE_LIST_SELECTIONS,
  BLOG_TAG_BASE_SELECTIONS,
  TAG_ADVANCED_OUTPUT_SELECTIONS,
  TAG_LIST_OUTPUT_SELECTION,
} from './helpers/selections'

@Injectable()
export class BlogDatabaseUtil {
  private readonly TAG_TTL: number
  private readonly ARTICLE_TTL: number

  constructor(
    private readonly db: BlogDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil,
    config: ConfigService,
    @InjectRedis() private readonly cache: Redis,
  ) {
    this.TAG_TTL = config.get<number>('TAVERN_BLOG_TAG_CACHE_TTL', 300)
    this.ARTICLE_TTL = config.get<number>('TAVERN_BLOG_ARTICLE_CACHE_TTL', 300)
  }

  async getUserById(id: string): Promise<boolean> {
    this.stringUtil.validateId(id)

    const user = await this.db.userSnapshot.findUnique({
      where: { userId: id },
      select: { userId: true },
    })

    return user !== null
  }

  async getUserByNickname(nickname: string): Promise<boolean> {
    this.stringUtil.validateAnyString(nickname, BLOG_MESSAGES.INVALID_NICKNAME_STRING)

    const user = await this.db.userSnapshot.findUnique({
      where: { nickname },
      select: { userId: true },
    })

    return user !== null
  }

  async createProfile(data: AuthRegisteredMessage): Promise<void> {
    this.stringUtil.validateId(data.id)

    await this.db.userSnapshot.create({
      data: {
        userId: data.id,
        nickname: data.id,
      },
    })
  }

  async updateUserNickname(id: string, nickname: string): Promise<void> {
    this.stringUtil.validateId(id)
    this.stringUtil.validateAnyString(nickname, BLOG_MESSAGES.INVALID_NICKNAME_STRING)

    await this.db.userSnapshot.update({
      where: { userId: id },
      data: { nickname },
    })
  }

  async deleteUser(id: string): Promise<void> {
    this.stringUtil.validateId(id)

    await this.db.userSnapshot.delete({
      where: { userId: id },
    })
  }

  private async getTagListOutput(where: TagWhereInput, skip: number, take: number): Promise<BlogTagListGrpcOutput[]> {
    return this.db.tag.findMany({
      where,
      skip,
      take,
      select: TAG_LIST_OUTPUT_SELECTION,
      orderBy: [{ createdAt: 'asc' }, { slug: 'asc' }],
    })
  }

  async getPaginatedTags(pagination: BlogTagPaginationGrpcInput): Promise<PaginatedBlogTagsOutput> {
    const safePagination = pagination || {}
    const where = this.buildQueryForTag(safePagination)
    const total = await this.db.tag.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)

    return {
      pagination: {
        ...params,
        search: safePagination.search,
      },
      tags: await this.getTagListOutput(where, params.skip, params.limit),
    }
  }

  async getTagBySlug(slug: string): Promise<BlogTagDetailedOutput | null> {
    this.stringUtil.validateAnyString(slug, BLOG_MESSAGES.INVALID_TAG_SLUG_STRING)

    const cached = await this.cache.get(`blog-tag:${slug}`)
    if (cached) {
      return JSON.parse(cached)
    }

    const response = await this.db.tag.findUnique({
      where: { slug },
      select: TAG_ADVANCED_OUTPUT_SELECTIONS,
    })

    const mappedResponse = mapDetailedTagOutput(response)

    if (mappedResponse !== null) {
      await this.cache.set(`blog-tag:${slug}`, JSON.stringify(mappedResponse), 'EX', this.TAG_TTL)
    }

    return mappedResponse
  }

  async createTag(data: CreateBlogTagInput, slug: string): Promise<BlogTagOutput> {
    this.stringUtil.validateAnyString(data.name, BLOG_MESSAGES.INVALID_TAG_NAME_STRING)
    this.stringUtil.validateAnyString(slug, BLOG_MESSAGES.INVALID_TAG_SLUG_STRING)

    return this.db.tag.create({
      data: {
        name: data.name,
        slug,
      },
      select: BLOG_TAG_BASE_SELECTIONS,
    })
  }

  async deleteTag(slug: string): Promise<void> {
    this.stringUtil.validateAnyString(slug, BLOG_MESSAGES.INVALID_TAG_SLUG_STRING)

    await this.db.tag.delete({
      where: { slug },
    })

    await this.cache.del(`blog-tag:${slug}`)
  }

  private async getArticleList(
    where: ArticleWhereInput,
    skip: number,
    take: number,
  ): Promise<BlogArticleListGrpcOutput[]> {
    const response = await this.db.article.findMany({
      where,
      skip,
      take,
      select: BLOG_ARTICLE_LIST_SELECTIONS,
      orderBy: [{ updatedAt: 'asc' }, { slug: 'asc' }],
    })

    return mapArticleListOutput(response)
  }

  async getPaginatedArticles(
    pagination: BlogArticlePaginationGrpcInput,
    authorId?: string,
  ): Promise<PaginatedBlogArticlesOutput> {
    if (authorId !== undefined) {
      this.stringUtil.validateId(authorId)
    }

    const safePagination = pagination || {}
    const where = this.buildQueryForArticle(safePagination, authorId)
    const total = await this.db.article.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)

    return {
      pagination: {
        ...params,
        search: safePagination.search,
        dateFrom: safePagination.dateFrom,
        dateTo: safePagination.dateTo,
        tags: safePagination.tags,
        authorNickname: safePagination.authorNickname,
      },
      articles: await this.getArticleList(where, params.skip, params.limit),
    }
  }

  async getArticleBySlug(slug: string): Promise<BlogArticleBySlugOutput | null> {
    this.stringUtil.validateAnyString(slug, BLOG_MESSAGES.INVALID_ARTICLE_SLUG_STRING)

    const cached = await this.cache.get(`blog-article:${slug}`)
    if (cached) {
      return JSON.parse(cached)
    }

    const response = await this.db.article.findUnique({
      where: { slug },
      select: BLOG_ARTICLE_BY_SLUG_SELECTIONS,
    })

    if (response === null) {
      return null
    }

    const mappedResponse = mapArticleBySlugOutput(response)

    await this.cache.set(`blog-article:${slug}`, JSON.stringify(mappedResponse), 'EX', this.ARTICLE_TTL)

    return mappedResponse
  }

  async areTagsExist(input: string[]): Promise<boolean> {
    const unique = [...new Set(input)]

    const count = await this.db.tag.count({
      where: { slug: { in: unique } },
    })

    return count === unique.length
  }

  async createArticle(data: CreateBlogArticleInput, slug: string, authorId: string): Promise<BlogArticleBySlugOutput> {
    this.stringUtil.validateAnyString(data.name, BLOG_MESSAGES.INVALID_ARTICLE_NAME_STRING)
    this.stringUtil.validateAnyString(data.shortDesc, BLOG_MESSAGES.INVALID_ARTICLE_SHORT_DESC_STRING)
    this.stringUtil.validateAnyString(data.content, BLOG_MESSAGES.INVALID_ARTICLE_CONTENT_STRING)
    this.stringUtil.validateAnyString(slug, BLOG_MESSAGES.INVALID_ARTICLE_SLUG_STRING)
    this.stringUtil.validateId(authorId)

    const response = await this.db.article.create({
      data: {
        name: data.name,
        slug,
        shortDesc: data.shortDesc,
        content: data.content,
        authorId: data.isAnonim ? undefined : authorId,
        isPublished: data.isAnonim ? true : false,
        tags: {
          connect: data.tags.map((item) => ({ slug: item })),
        },
      },
      select: BLOG_ARTICLE_BY_SLUG_SELECTIONS,
    })

    return mapArticleBySlugOutput(response)
  }

  async updateArticleStatus(slug: string, newStatus: boolean): Promise<BlogArticleBySlugOutput> {
    this.stringUtil.validateAnyString(slug, BLOG_MESSAGES.INVALID_ARTICLE_SLUG_STRING)

    const response = await this.db.article.update({
      where: { slug },
      data: { isPublished: newStatus },
      select: BLOG_ARTICLE_BY_SLUG_SELECTIONS,
    })

    await this.cache.del(`blog-article:${slug}`)

    return mapArticleBySlugOutput(response)
  }

  async updateArticle(data: UpdateBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    this.stringUtil.validateAnyString(data.slug, BLOG_MESSAGES.INVALID_ARTICLE_SLUG_STRING)

    if (data.content !== undefined) {
      this.stringUtil.validateAnyString(data.content, BLOG_MESSAGES.INVALID_ARTICLE_CONTENT_STRING)
    }

    if (data.shortDesc !== undefined) {
      this.stringUtil.validateAnyString(data.shortDesc, BLOG_MESSAGES.INVALID_ARTICLE_SHORT_DESC_STRING)
    }

    const response = await this.db.article.update({
      where: { slug: data.slug },
      data: {
        isUpdated: true,
        ...(data.tags !== undefined && {
          tags: {
            set: data.tags.map((slug) => ({ slug })),
          },
        }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.shortDesc !== undefined && { shortDesc: data.shortDesc }),
      },
      select: BLOG_ARTICLE_BY_SLUG_SELECTIONS,
    })

    await this.cache.del(`blog-article:${data.slug}`)

    return mapArticleBySlugOutput(response)
  }

  async deleteArticle(slug: string): Promise<void> {
    this.stringUtil.validateAnyString(slug, BLOG_MESSAGES.INVALID_ARTICLE_SLUG_STRING)

    await this.db.article.delete({
      where: { slug },
    })

    await this.cache.del(`blog-article:${slug}`)
  }

  buildQueryForTag(query: BlogTagPaginationGrpcInput): TagWhereInput {
    const where: TagWhereInput = {}

    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }]
    }

    return where
  }

  buildQueryForArticle(query: BlogArticlePaginationGrpcInput, authorId?: string): ArticleWhereInput {
    const where: ArticleWhereInput = {
      isPublished: authorId ? undefined : true,
      ...(authorId ? { authorId } : {}),
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { shortDesc: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {}

      if (query.dateFrom) {
        const dateFrom = new Date(query.dateFrom)

        where.createdAt.gte = dateFrom
      }

      if (query.dateTo) {
        const dateTo = new Date(query.dateTo)

        where.createdAt.lte = dateTo
      }
    }

    if (query.tags && query.tags.length > 0) {
      where.tags = {
        some: { slug: { in: query.tags } },
      }
    }

    if (query.authorNickname) {
      where.author = {
        nickname: { contains: query.authorNickname, mode: 'insensitive' },
      }
    }

    return where
  }
}
