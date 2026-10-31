import { Injectable } from '@nestjs/common'
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
}
