import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { BlogDatabaseService, TagWhereInput } from '@org/blog-database'
import {
  BlogTagDetailedOutput,
  BlogTagListGrpcOutput,
  BlogTagOutput,
  BlogTagPaginationGrpcInput,
  CreateBlogTagInput,
  PaginatedBlogTagsOutput,
} from '@org/grpc-types'
import { AuthRegisteredMessage } from '@org/rmq-messages'
import { PaginationUtil, StringValidationUtil } from '@org/shared-utils'
import { BLOG_MESSAGES } from '@org/validation-messages'
import Redis from 'ioredis'

import { mapDetailedTagOutput } from './helpers/map-response'
import {
  BLOG_TAG_BASE_SELECTIONS,
  TAG_ADVANCED_OUTPUT_SELECTIONS,
  TAG_LIST_OUTPUT_SELECTION,
} from './helpers/selections'

@Injectable()
export class BlogDatabaseUtil {
  private readonly TAG_TTL: number

  constructor(
    private readonly db: BlogDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil,
    config: ConfigService,
    @InjectRedis() private readonly cache: Redis,
  ) {
    this.TAG_TTL = config.get<number>('TAVERN_BLOG_TAG_CACHE_TTL', 300)
  }

  // USER

  async getUserById(id: string): Promise<boolean> {
    const user = await this.db.userSnapshot.findUnique({
      where: {
        userId: id,
      },
    })
    return user !== null
  }

  async getUserByNickname(nickname: string): Promise<boolean> {
    const user = await this.db.userSnapshot.findUnique({
      where: {
        nickname,
      },
    })
    return user !== null
  }

  async createProfile(data: AuthRegisteredMessage): Promise<void> {
    await this.db.userSnapshot.create({
      data: {
        userId: data.id,
        nickname: data.id,
      },
    })
  }

  async updateUserNickname(id: string, nickname: string): Promise<void> {
    await this.db.userSnapshot.update({
      where: {
        userId: id,
      },
      data: {
        nickname,
      },
    })
  }

  async deleteUser(id: string): Promise<void> {
    await this.db.userSnapshot.delete({
      where: { userId: id },
    })
  }

  // TAG

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
    const cache = await this.cache.get(`blog-tag:${slug}`)
    if (cache) {
      return JSON.parse(cache)
    }
    const response = await this.db.tag.findUnique({
      where: {
        slug,
      },
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
    return await this.db.tag.create({
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

  // QUERY Builders

  buildQueryForTag(query: BlogTagPaginationGrpcInput): TagWhereInput {
    const where: TagWhereInput = {}

    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }]
    }

    return where
  }
}
