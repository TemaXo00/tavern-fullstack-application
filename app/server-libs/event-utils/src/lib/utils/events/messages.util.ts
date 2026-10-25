import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { EVENT_EVENTS_MESSAGES } from '@org/rmq-messages'

import type {
  AdminCheckBySlugMessage,
  AdminCheckPrivatePaginatedMessage,
  EventEventsAdminChangeOrganizerMessage,
  EventEventsAdminDeleteMessage,
  EventEventsAuthorChangeJoin,
  EventEventsAuthorChangeOrganizer,
  EventEventsAuthorManipulateMessages,
} from '@org/rmq-messages'

@Injectable()
export class EventEventsMessagesUtil {
  constructor(
    @Inject('LOG_CLIENT') private readonly log: ClientProxy,
    @Inject('MAIL_CLIENT') private readonly mail: ClientProxy,
  ) {}

  authorCreated(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_CREATED, data)
  }

  authorUpdated(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_UPDATED, data)
  }

  authorPublished(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_PUBLISHED, data)
    this.mail.emit(EVENT_EVENTS_MESSAGES.AUTHOR_PUBLISHED, data)
  }

  authorCancelled(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_CANCELLED, data)
    this.mail.emit(EVENT_EVENTS_MESSAGES.AUTHOR_CANCELLED, data)
  }

  authorFinished(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_FINISHED, data)
    this.mail.emit(EVENT_EVENTS_MESSAGES.AUTHOR_FINISHED, data)
  }

  authorChangeJoin(data: EventEventsAuthorChangeJoin): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_CHANGE_JOIN, data)
    this.mail.emit(EVENT_EVENTS_MESSAGES.AUTHOR_CHANGE_JOIN, data)
  }

  authorChangeOrganizer(data: EventEventsAuthorChangeOrganizer): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_ORGANIZER, data)
    this.mail.emit(EVENT_EVENTS_MESSAGES.AUTHOR_ORGANIZER, data)
  }

  authorDeleted(data: EventEventsAuthorManipulateMessages): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.AUTHOR_DELETED, data)
    this.mail.emit(EVENT_EVENTS_MESSAGES.AUTHOR_DELETED, data)
  }

  adminChangeOrganizer(data: EventEventsAdminChangeOrganizerMessage): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.ADMIN_CHANGE_ORGANIZER, data)
    this.mail.emit(EVENT_EVENTS_MESSAGES.ADMIN_CHANGE_ORGANIZER, data)
  }

  adminDelete(data: EventEventsAdminDeleteMessage): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.ADMIN_DELETE, data)
    this.mail.emit(EVENT_EVENTS_MESSAGES.ADMIN_DELETE, data)
  }

  adminCheckPrivatePaginated(data: AdminCheckPrivatePaginatedMessage): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.ADMIN_CHECK_PRIVATE_PAGINATED, data)
  }

  adminCheckBySlug(data: AdminCheckBySlugMessage): void {
    this.log.emit(EVENT_EVENTS_MESSAGES.ADMIN_CHECK_BY_SLUG, data)
  }
}
