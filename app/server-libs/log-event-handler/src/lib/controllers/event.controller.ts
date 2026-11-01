import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  type AdminCheckBySlugMessage,
  type AdminCheckPrivatePaginatedMessage,
  EVENT_EVENTS_MESSAGES,
  type EventEventsAdminChangeOrganizerMessage,
  type EventEventsAdminDeleteMessage,
  type EventEventsAuthorChangeJoin,
  type EventEventsAuthorChangeOrganizer,
  type EventEventsAuthorManipulateMessages,
} from '@org/rmq-messages'

@Controller()
export class EventController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(EVENT_EVENTS_MESSAGES.AUTHOR_CREATED)
  async handleAuthorCreated(@Payload() data: EventEventsAuthorManipulateMessages): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.AUTHOR_CREATED,
      actionDesc: 'Organizer created event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.AUTHOR_UPDATED)
  async handleAuthorUpdated(@Payload() data: EventEventsAuthorManipulateMessages): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.AUTHOR_UPDATED,
      actionDesc: 'Organizer updated event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.AUTHOR_PUBLISHED)
  async handleAuthorPublished(@Payload() data: EventEventsAuthorManipulateMessages): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.AUTHOR_PUBLISHED,
      actionDesc: 'Organizer published event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.AUTHOR_CANCELLED)
  async handleAuthorCancelled(@Payload() data: EventEventsAuthorManipulateMessages): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.AUTHOR_CANCELLED,
      actionDesc: 'Organizer cancelled event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.AUTHOR_FINISHED)
  async handleAuthorFinished(@Payload() data: EventEventsAuthorManipulateMessages): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.AUTHOR_FINISHED,
      actionDesc: 'Organizer finished event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.AUTHOR_CHANGE_JOIN)
  async handleAuthorChangeJoin(@Payload() data: EventEventsAuthorChangeJoin): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.AUTHOR_CHANGE_JOIN,
      actionDesc: 'Organizer changed join lock of event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.AUTHOR_ORGANIZER)
  async handleAuthorChangeOrganizer(@Payload() data: EventEventsAuthorChangeOrganizer): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.AUTHOR_ORGANIZER,
      actionDesc: 'Organizer changed organizer of event',
      isAdminAction: false,
      logBody: data,
      actorId: data.previousId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.AUTHOR_DELETED)
  async handleAuthorDeleted(@Payload() data: EventEventsAuthorManipulateMessages): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.AUTHOR_DELETED,
      actionDesc: 'Organizer deleted event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.ADMIN_CHANGE_ORGANIZER)
  async handleAdminChangeOrganizer(@Payload() data: EventEventsAdminChangeOrganizerMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.ADMIN_CHANGE_ORGANIZER,
      actionDesc: 'Admin changed organizer of event',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.ADMIN_DELETE)
  async handleAdminDelete(@Payload() data: EventEventsAdminDeleteMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.ADMIN_DELETE,
      actionDesc: 'Admin deleted event',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.ADMIN_CHECK_PRIVATE_PAGINATED)
  async handleAdminCheckPrivatePaginated(@Payload() data: AdminCheckPrivatePaginatedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.ADMIN_CHECK_PRIVATE_PAGINATED,
      actionDesc: 'Admin requested paginated private events',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(EVENT_EVENTS_MESSAGES.ADMIN_CHECK_BY_SLUG)
  async handleAdminCheckBySlug(@Payload() data: AdminCheckBySlugMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Event',
      action: EVENT_EVENTS_MESSAGES.ADMIN_CHECK_BY_SLUG,
      actionDesc: 'Admin requested event by slug',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }
}
