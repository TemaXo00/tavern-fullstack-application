import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { BlogArticleBySlugOutput, BlogTagDetailedOutput } from '@org/grpc-types'
import { RmqLoggerUtil } from '@org/shared-utils'
import { BLOG_MESSAGES } from '@org/validation-messages'

import { BlogDatabaseUtil } from './database.util'

@Injectable()
export class BlogValidationUtil {
  constructor(
    private readonly dbUtil: BlogDatabaseUtil,
    private readonly logger: RmqLoggerUtil,
  ) {}

  async isUserExisting(id: string): Promise<boolean> {
    if (!(await this.dbUtil.getUserById(id))) {
      this.logger.logError(
        BLOG_MESSAGES.USER_SNAPSHOT_EXISTING_ERROR.CONTEXT,
        BLOG_MESSAGES.USER_SNAPSHOT_EXISTING_ERROR.METHOD,
        BLOG_MESSAGES.USER_SNAPSHOT_EXISTING_ERROR.MESSAGE(id),
      )
      return false
    }
    return true
  }

  async isNicknameFree(nickname: string): Promise<boolean> {
    if (await this.dbUtil.getUserByNickname(nickname)) {
      this.logger.logError(
        BLOG_MESSAGES.USER_SNAPSHOT_NICKNAME_EXISTING_ERROR.CONTEXT,
        BLOG_MESSAGES.USER_SNAPSHOT_NICKNAME_EXISTING_ERROR.METHOD,
        BLOG_MESSAGES.USER_SNAPSHOT_NICKNAME_EXISTING_ERROR.MESSAGE(nickname),
      )
      return false
    }
    return true
  }

  async checkTagExisting(slug: string): Promise<BlogTagDetailedOutput> {
    const tag = await this.dbUtil.getTagBySlug(slug)
    if (!tag) {
      throw new RpcException({
        message: BLOG_MESSAGES.TAG_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }
    return tag
  }

  async checkTagSlugUnique(slug: string): Promise<void> {
    const tag = await this.dbUtil.getTagBySlug(slug)
    if (tag) {
      throw new RpcException({
        message: BLOG_MESSAGES.TAG_SLUG_EXISTING,
        code: status.ALREADY_EXISTS,
      })
    }
  }

  async checkArticleExisting(slug: string): Promise<BlogArticleBySlugOutput> {
    const article = await this.dbUtil.getArticleBySlug(slug)
    if (!article) {
      throw new RpcException({
        message: BLOG_MESSAGES.ARTICLE_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }
    return article
  }

  checkArticlePublished(isPublished: boolean): void {
    if (!isPublished) {
      throw new RpcException({
        message: BLOG_MESSAGES.ARTICLE_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }
  }

  checkArticleOnCurrentUser(payloadId: string, authorId?: string): void {
    if (payloadId !== authorId) {
      throw new RpcException({
        message: BLOG_MESSAGES.ARTICLE_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }
  }

  throwAuthorOfArticleNotFound(): never {
    throw new RpcException({
      message: BLOG_MESSAGES.AUTHOR_NOT_FOUND,
      code: status.NOT_FOUND,
    })
  }

  async checkTagsExisting(tags: string[]): Promise<void> {
    if (!(await this.dbUtil.areTagsExist(tags))) {
      throw new RpcException({
        message: BLOG_MESSAGES.ONE_OR_MANY_TAGS_NOT_FOUND,
        code: status.INVALID_ARGUMENT,
      })
    }
  }

  async checkArticleSlugUnique(slug: string): Promise<void> {
    const article = await this.dbUtil.getArticleBySlug(slug)
    if (article) {
      throw new RpcException({
        message: BLOG_MESSAGES.ARTICLE_SLUG_EXISTING,
        code: status.ALREADY_EXISTS,
      })
    }
  }

  checkArticleStatus(currentStatus: boolean, newStatus: boolean): void {
    if (currentStatus === newStatus) {
      throw new RpcException({
        message: BLOG_MESSAGES.ARTICLE_STATUS_CONFLICT,
        code: status.ALREADY_EXISTS,
      })
    }
  }
}
