import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import { BLOG_TAG_MESSAGES, type BlogTagCreatedMessage, type BlogTagDeletedMessage } from '@org/rmq-messages'

@Controller()
export class TagController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(BLOG_TAG_MESSAGES.TAG_CREATE)
  async handleCreateTag(@Payload() data: BlogTagCreatedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'BLOG',
      serviceName: 'Tag',
      action: BLOG_TAG_MESSAGES.TAG_CREATE,
      actionDesc: 'Admin created blog tag',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(BLOG_TAG_MESSAGES.TAG_DELETE)
  async handleDeleteTag(@Payload() data: BlogTagDeletedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'BLOG',
      serviceName: 'Tag',
      action: BLOG_TAG_MESSAGES.TAG_DELETE,
      actionDesc: 'Admin deleted blog tag',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }
}
