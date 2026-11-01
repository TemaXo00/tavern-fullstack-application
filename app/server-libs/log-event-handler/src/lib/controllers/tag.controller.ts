import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  EVENT_TAG_MESSAGES,
  type EventTagCreatedMessage,
  type EventTagDeletedMessage,
  type EventTagUpdatedMessage,
} from '@org/rmq-messages'

@Controller()
export class TagController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(EVENT_TAG_MESSAGES.TAG_CREATE)
  async handleCreateTag(@Payload() data: EventTagCreatedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Tag',
      action: EVENT_TAG_MESSAGES.TAG_CREATE,
      actionDesc: 'Admin created event tag',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(EVENT_TAG_MESSAGES.TAG_UPDATE)
  async handleUpdateTag(@Payload() data: EventTagUpdatedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Tag',
      action: EVENT_TAG_MESSAGES.TAG_UPDATE,
      actionDesc: 'Admin updated event tag',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(EVENT_TAG_MESSAGES.TAG_DELETE)
  async handleDeleteTag(@Payload() data: EventTagDeletedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Tag',
      action: EVENT_TAG_MESSAGES.TAG_DELETE,
      actionDesc: 'Admin deleted event tag',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }
}
