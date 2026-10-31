import { Injectable } from '@nestjs/common'
import { BlogDatabaseUtil, BlogValidationUtil } from '@org/blog-utils'
import { UpdateProfile } from '@org/rmq-messages'
import { RmqLoggerUtil } from '@org/shared-utils'
import { BLOG_MESSAGES } from '@org/validation-messages'

@Injectable()
export class ProfileRmqService {
  constructor(
    private readonly dbUtil: BlogDatabaseUtil,
    private readonly validation: BlogValidationUtil,
    private readonly logger: RmqLoggerUtil,
  ) {}

  async handleProfileChangeNickname(data: UpdateProfile): Promise<void> {
    if (data.data.nickname) {
      if (
        !(await this.validation.isNicknameFree(data.data.nickname)) ||
        !(await this.validation.isUserExisting(data.userId))
      ) {
        return
      }

      await this.dbUtil.updateUserNickname(data.userId, data.data.nickname)
      this.logger.logSuccess(
        BLOG_MESSAGES.USER_CHANGE_NICKNAME_SUCCESS.CONTEXT,
        BLOG_MESSAGES.USER_CHANGE_NICKNAME_SUCCESS.METHOD(data.userId),
      )
    } else {
      this.logger.logWarning(
        BLOG_MESSAGES.USER_CHANGE_NICKNAME_WARNING.CONTEXT,
        BLOG_MESSAGES.USER_CHANGE_NICKNAME_WARNING.METHOD(data.userId),
        BLOG_MESSAGES.USER_CHANGE_NICKNAME_WARNING.MESSAGE,
      )
    }
  }
}
