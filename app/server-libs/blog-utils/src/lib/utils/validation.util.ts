import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { BlogTagDetailedOutput } from '@org/grpc-types'
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

  async checkSlugUnique(slug: string): Promise<void> {
    const tag = await this.dbUtil.getTagBySlug(slug)
    if (tag) {
      throw new RpcException({
        message: BLOG_MESSAGES.TAG_SLUG_EXISTING,
        code: status.ALREADY_EXISTS,
      })
    }
  }
}
