import { Injectable } from '@nestjs/common'
import { BlogDatabaseUtil, BlogValidationUtil } from '@org/blog-utils'
import { AuthRegisteredMessage, DeleteUserMessage } from '@org/rmq-messages'
import { RmqLoggerUtil } from '@org/shared-utils'
import { BLOG_MESSAGES } from '@org/validation-messages'

@Injectable()
export class AuthRmqService {
  constructor(
    private readonly dbUtil: BlogDatabaseUtil,
    private readonly validateUtil: BlogValidationUtil,
    private readonly logger: RmqLoggerUtil,
  ) {}

  async handleUserRegistered(data: AuthRegisteredMessage): Promise<void> {
    await this.dbUtil.createProfile(data)
    this.logger.logSuccess(
      BLOG_MESSAGES.USER_SHAPSHOT_CREATE_SUCCESS.CONTEXT,
      BLOG_MESSAGES.USER_SHAPSHOT_CREATE_SUCCESS.METHOD(data.id),
    )
  }

  async handleUserDeleted(data: DeleteUserMessage): Promise<void> {
    if (!(await this.validateUtil.isUserExisting(data.userId))) {
      return
    }
    await this.dbUtil.deleteUser(data.userId)
    this.logger.logSuccess(
      BLOG_MESSAGES.USER_DELETE_SUCCESS.CONTEXT,
      BLOG_MESSAGES.USER_DELETE_SUCCESS.METHOD(data.userId),
    )
  }
}
