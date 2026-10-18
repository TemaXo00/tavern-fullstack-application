import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { EVENT_EVENTS_MESSAGES } from '@org/rmq-messages'

import type {
  EventEventsAdminChangeOrganizerMessage,
  EventEventsAdminDeleteMessage,
  EventEventsAuthorManipulateMessages,
} from '@org/rmq-messages'

@Injectable()
export class EventEventsMessagesUtil {
  constructor(@Inject('LOG_CLIENT') private readonly log: ClientProxy) {}

  authorCreated(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_CREATED, data)
  }

  authorUpdated(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_UPDATED, data)
  }

  authorPublished(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_PUBLISHED, data)
  }

  authorCancelled(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_CANCELLED, data)
  }

  authorFinished(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_FINISHED, data)
  }

  authorDeleted(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_DELETED, data)
  }

  adminChangeOrganizer(data: EventEventsAdminChangeOrganizerMessage): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.ADMIN_CHANGE_ORGANIZER, data)
  }

  adminDelete(data: EventEventsAdminDeleteMessage): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.ADMIN_DELETE, data)
  }
}
