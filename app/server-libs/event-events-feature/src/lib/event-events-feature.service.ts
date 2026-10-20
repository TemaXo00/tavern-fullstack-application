import { Injectable } from '@nestjs/common'
import { AuthValidateService } from '@org/auth-authorization-core'
import { GRPC_TO_EVENT_STATUSES, Roles } from '@org/enums'
import { EventEventsDatabaseUtil, EventEventsMessagesUtil, EventEventsValidationUtil } from '@org/event-utils'
import { SlugUtil } from '@org/shared-utils'

import type {
  CancelEventInput,
  ChangeLockInput,
  CreateEventInput,
  DeleteEventInput,
  DeleteOtherEventInput,
  EventEventsServiceContract,
  EventMethodsOutput,
  EventOutput,
  FinishEventInput,
  GetPrivateEventBySlug,
  GetPrivateUserEventsInput,
  GetPublicEventBySlug,
  GetPublicUserEventsInput,
  PaginatedPrivateEventsInput,
  PaginatedPrivateEventsOutput,
  PaginatedPublicEventsInput,
  PaginatedPublicEventsOutput,
  PublishEventInput,
  SwitchOrganizerInput,
  UpdateEventDataInput,
} from '@org/grpc-types'

@Injectable()
export class EventEventsFeatureService implements EventEventsServiceContract {
  constructor(
    private readonly validate: AuthValidateService,
    private readonly dbUtil: EventEventsDatabaseUtil,
    private readonly validationUtil: EventEventsValidationUtil,
    private readonly messagesUtil: EventEventsMessagesUtil,
    private readonly slugUtil: SlugUtil,
  ) {}

  async GetPublicEvents(data: PaginatedPublicEventsInput): Promise<PaginatedPublicEventsOutput> {
    return await this.dbUtil.getPublicPaginatedEvents(data.pagination)
  }

  async GetPrivateEvents(data: PaginatedPrivateEventsInput): Promise<PaginatedPrivateEventsOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const answer = await this.dbUtil.getPrivatePaginatedEvents(data.pagination)
    this.messagesUtil.adminCheckPrivatePaginated({ adminId: payload.id, query: data.pagination })
    return answer
  }

  async GetMyEvents(data: PaginatedPrivateEventsInput): Promise<PaginatedPrivateEventsOutput> {
    const payload = await this.validate.Validate(data.validation)
    await this.validationUtil.checkUserExists('by-id', payload.id)
    return await this.dbUtil.getPrivatePaginatedEvents(data.pagination, payload.id)
  }

  async GetPublicUserEvents(data: GetPublicUserEventsInput): Promise<PaginatedPublicEventsOutput> {
    const userId = await this.validationUtil.checkUserExists('nickname', data.nickname)
    return await this.dbUtil.getPublicPaginatedEvents(data.pagination, userId)
  }

  async GetPrivateUserEvents(data: GetPrivateUserEventsInput): Promise<PaginatedPrivateEventsOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const userId = await this.validationUtil.checkUserExists('nickname', data.nickname)
    const answer = await this.dbUtil.getPrivatePaginatedEvents(data.pagination, userId)
    this.messagesUtil.adminCheckPrivatePaginated({ adminId: payload.id, query: data.pagination })
    return answer
  }

  async GetPublicEventBySlug(data: GetPublicEventBySlug): Promise<EventOutput> {
    const event = await this.validationUtil.checkEventExists(data.slug, true)
    await this.validationUtil.checkEventStatus(
      data.slug,
      GRPC_TO_EVENT_STATUSES[event.status],
      event.dateAndTime,
      event.organizerId,
    )
    return event
  }

  async GetPrivateEventBySlug(data: GetPrivateEventBySlug): Promise<EventOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const event = await this.validationUtil.checkEventExists(data.slug)
    this.validationUtil.checkEventPermission(payload.id, event.organizerId, GRPC_TO_EVENT_STATUSES[event.status])
    this.messagesUtil.adminCheckBySlug({ adminId: payload.id, eventSlug: data.slug })
    return event
  }

  async GetMyEventBySlug(data: GetPrivateEventBySlug): Promise<EventOutput> {
    const payload = await this.validate.Validate(data.validation)
    const event = await this.validationUtil.checkEventExists(data.slug)
    this.validationUtil.checkOrganizer(payload.id, event.organizerId)
    return event
  }

  async CreateEvent(data: CreateEventInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN, Roles.MODERATOR])
    const slug = this.slugUtil.createSlug(data.name)
    await this.validationUtil.checkSlugUnique(slug)
    await this.validationUtil.checkTagsExisting(data.tags)
    const response = await this.dbUtil.createEvent(
      {
        name: data.name,
        dateAndTime: data.dateAndTime,
        description: data.description ?? undefined,
        totalPlaces: data.totalPlaces,
        tags: data.tags,
      },
      slug,
      payload.id,
    )
    this.messagesUtil.authorCreated({ organizerId: payload.id, eventSlug: slug })
    return response
  }

  async PublishEvent(data: PublishEventInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const event = await this.validationUtil.checkMethodsEventsExists(data.slug)
    this.validationUtil.checkOrganizer(payload.id, event.organizerId)
    this.validationUtil.checkEventIsDraft(GRPC_TO_EVENT_STATUSES[event.status])
    const response = await this.dbUtil.updateEventStatus('PUBLISHED', data.slug, payload.id)
    this.messagesUtil.authorPublished({ organizerId: payload.id, eventSlug: data.slug })
    return response
  }

  async CancelEvent(data: CancelEventInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const event = await this.validationUtil.checkMethodsEventsExists(data.slug)
    this.validationUtil.checkOrganizer(payload.id, event.organizerId)
    this.validationUtil.checkEventPublished(GRPC_TO_EVENT_STATUSES[event.status])
    const response = await this.dbUtil.updateEventStatus('CANCELLED', data.slug, payload.id)
    this.messagesUtil.authorCancelled({ organizerId: payload.id, eventSlug: data.slug })
    return response
  }

  async FinishEvent(data: FinishEventInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const event = await this.validationUtil.checkMethodsEventsExists(data.slug)
    this.validationUtil.checkOrganizer(payload.id, event.organizerId)
    this.validationUtil.checkEventPublished(GRPC_TO_EVENT_STATUSES[event.status])
    const response = await this.dbUtil.updateEventStatus('FINISHED', data.slug, payload.id)
    this.messagesUtil.authorFinished({ organizerId: payload.id, eventSlug: data.slug })
    return response
  }

  async ChangeLock(data: ChangeLockInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const event = await this.validationUtil.checkMethodsEventsExists(data.slug)
    this.validationUtil.checkOrganizer(payload.id, event.organizerId)
    this.validationUtil.checkEventPublished(GRPC_TO_EVENT_STATUSES[event.status])
    const response = await this.dbUtil.updateEventLock(data.slug, event.isJoinBlocked, payload.id)
    this.messagesUtil.authorChangeJoin({
      organizerId: payload.id,
      eventSlug: data.slug,
      currentState: response.isJoinBlocked,
    })
    return response
  }

  async SwitchOrganizer(data: SwitchOrganizerInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const event = await this.validationUtil.checkMethodsEventsExists(data.slug)
    this.validationUtil.checkOrganizer(payload.id, event.organizerId)
    this.validationUtil.checkEventPublished(GRPC_TO_EVENT_STATUSES[event.status])
    const newOrganizer = await this.validationUtil.checkUserExists('nickname', data.organizerNickname)
    const response = await this.dbUtil.updateEventOrganizer(data.slug, newOrganizer, payload.id)
    this.messagesUtil.authorChangeOrganizer({ eventSlug: data.slug, previousId: payload.id, newId: newOrganizer })
    return response
  }

  async SwitchOtherEventOrganizer(data: SwitchOrganizerInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const event = await this.validationUtil.checkMethodsEventsExists(data.slug)
    this.validationUtil.checkEventPublished(GRPC_TO_EVENT_STATUSES[event.status])
    const newOrganizer = await this.validationUtil.checkUserExists('nickname', data.organizerNickname)
    const response = await this.dbUtil.updateEventOrganizer(data.slug, newOrganizer, event.organizerId)
    this.messagesUtil.adminChangeOrganizer({
      eventSlug: event.slug,
      adminId: payload.id,
      previousId: event.organizerId,
      newId: newOrganizer,
    })
    return response
  }

  async UpdateEvent(data: UpdateEventDataInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const event = await this.validationUtil.checkMethodsEventsExists(data.slug)
    this.validationUtil.checkOrganizer(payload.id, event.organizerId)
    this.validationUtil.checkEventIsDraft(GRPC_TO_EVENT_STATUSES[event.status])
    return await this.dbUtil.updateEvent(data)
  }

  async DeleteEvent(data: DeleteEventInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const event = await this.validationUtil.checkMethodsEventsExists(data.slug)
    this.validationUtil.checkOrganizer(payload.id, event.organizerId)
    const response = await this.dbUtil.deleteEvent(data.slug)
    this.messagesUtil.authorDeleted({ eventSlug: data.slug, organizerId: payload.id })
    return response
  }

  async DeleteOtherEvent(data: DeleteOtherEventInput): Promise<EventMethodsOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.validationUtil.checkMethodsEventsExists(data.slug)
    const response = await this.dbUtil.deleteEvent(data.slug)
    this.messagesUtil.adminDelete({ adminId: payload.id, slug: data.slug, message: data.message })
    return response
  }
}
