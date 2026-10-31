import { Injectable } from '@nestjs/common'
import { AuthValidateService } from '@org/auth-authorization-core'
import { BlogDatabaseUtil, BlogMessagesUtil, BlogValidationUtil } from '@org/blog-utils'
import { Roles } from '@org/enums'
import { SlugUtil } from '@org/shared-utils'

import type {
  BlogArticleBySlugOutput,
  BlogArticleServiceContract,
  CreateBlogArticleInput,
  DeleteBlogArticleInput,
  Empty,
  GetBlogArticleBySlugInput,
  GetMyBlogArticleBySlugInput,
  GetMyPaginatedBlogArticles,
  GetPaginatedBlogArticlesInput,
  PaginatedBlogArticlesOutput,
  PublishBlogArticleInput,
  UnpublishBlogArticleInput,
  UpdateBlogArticleInput,
} from '@org/grpc-types'

@Injectable()
export class BlogArticleFeatureService implements BlogArticleServiceContract {
  constructor(
    private readonly dbUtil: BlogDatabaseUtil,
    private readonly validationUtil: BlogValidationUtil,
    private readonly messagesUtil: BlogMessagesUtil,
    private readonly validate: AuthValidateService,
    private readonly slug: SlugUtil,
  ) {}

  async GetArticles(data: GetPaginatedBlogArticlesInput): Promise<PaginatedBlogArticlesOutput> {
    return await this.dbUtil.getPaginatedArticles(data.pagination)
  }

  async GetMyArticles(data: GetMyPaginatedBlogArticles): Promise<PaginatedBlogArticlesOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    return await this.dbUtil.getPaginatedArticles(data.pagination, payload.id)
  }

  async GetArticleBySlug(data: GetBlogArticleBySlugInput): Promise<BlogArticleBySlugOutput> {
    const article = await this.validationUtil.checkArticleExisting(data.slug)
    this.validationUtil.checkArticlePublished(article.isPublished)
    return article
  }

  async GetMyArticleBySlug(data: GetMyBlogArticleBySlugInput): Promise<BlogArticleBySlugOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const article = await this.validationUtil.checkArticleExisting(data.slug)
    if (!article.authorId) {
      this.validationUtil.throwAuthorOfArticleNotFound()
    }
    this.validationUtil.checkArticleOnCurrentUser(payload.id, article.authorId)
    return article
  }

  async CreateArticle(data: CreateBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const slug = this.slug.createSlug(data.name)
    await this.validationUtil.checkArticleSlugUnique(slug)
    await this.validationUtil.checkTagsExisting(data.tags)
    const response = await this.dbUtil.createArticle(data, slug, payload.id)
    this.messagesUtil.createArticle({ authorId: payload.id, isAnonim: data.isAnonim, slug: slug })
    return response
  }

  async PublishArticle(data: PublishBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    const article = await this.GetMyArticleBySlug({ validation: data.validation, slug: data.slug })
    this.validationUtil.checkArticleStatus(article.isPublished, true)
    const response = await this.dbUtil.updateArticleStatus(data.slug, true)
    this.messagesUtil.publishArticle({ authorId: article.authorId, slug: data.slug, status: 'PUBLISHED' })
    return response
  }

  async UnpublishArticle(data: UnpublishBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    const article = await this.GetMyArticleBySlug({ validation: data.validation, slug: data.slug })
    this.validationUtil.checkArticleStatus(article.isPublished, false)
    const response = await this.dbUtil.updateArticleStatus(data.slug, false)
    this.messagesUtil.unpublishArticle({ authorId: article.authorId, slug: data.slug, status: 'UNPUBLISHED' })
    return response
  }

  async UpdateArticle(data: UpdateBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    const article = await this.GetMyArticleBySlug({ validation: data.validation, slug: data.slug })
    if (data.tags && data.tags.length > 0) {
      await this.validationUtil.checkTagsExisting(data.tags)
    }
    const updatedArticle = await this.dbUtil.updateArticle(data)
    this.messagesUtil.updateArticle({ authorId: article.authorId, slug: data.slug })
    return updatedArticle
  }

  async DeleteArticle(data: DeleteBlogArticleInput): Promise<Empty> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const article = await this.validationUtil.checkArticleExisting(data.slug)
    if (!article.isPublished && article.authorId) {
      this.validationUtil.checkArticleOnCurrentUser(payload.id, article.authorId)
    }
    await this.dbUtil.deleteArticle(data.slug)
    this.messagesUtil.deleteArticle({ adminId: payload.id, slug: data.slug })
    return {}
  }
}
