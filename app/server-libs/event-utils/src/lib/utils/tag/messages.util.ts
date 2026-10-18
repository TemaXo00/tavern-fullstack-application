import { Inject, Injectable } from '@nestjs/common'
import {
  EVENT_TAG_MESSAGES,
  type EventTagCreatedMessage,
  type EventTagUpdatedMessage,
  type EventTagDeletedMessage,
} from '@org/rmq-messages'

import type { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class EventTagMessagesUtil {
  constructor(@Inject('LOG_CLIENT') private readonly log: ClientProxy) {}

  create(data: EventTagCreatedMessage): void {
    this.log.emit(EVENT_TAG_MESSAGES.TAG_CREATE, data)
  }

  update(data: EventTagUpdatedMessage): void {
    this.log.emit(EVENT_TAG_MESSAGES.TAG_UPDATE, data)
  }

  delete(data: EventTagDeletedMessage): void {
    this.log.emit(EVENT_TAG_MESSAGES.TAG_DELETE, data)
  }
}
