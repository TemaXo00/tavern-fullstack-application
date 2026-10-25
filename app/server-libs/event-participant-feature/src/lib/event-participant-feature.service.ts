import { Injectable } from '@nestjs/common'
import { AuthValidateService } from '@org/auth-authorization-core'
import {
  EventParticipantDatabaseUtil,
  // EventParticipantMessagesUtil,
  EventParticipantValidationUtil,
} from '@org/event-utils'

import type {
  AddUserToEventInput,
  ChangeUserParticipantStatusInput,
  EventParticipantsServiceContract,
  GetEventParticipantsInput,
  GetMyParticipatedEventsInput,
  GetUserParticipatedEventsInput,
  JoinEventInput,
  LeaveEventInput,
  PaginatedEventParticipantsOutput,
  PaginatedParticipatedEventsOutput,
  EventParticipantOutput,
  RemoveUserFromEventInput,
} from '@org/grpc-types'

@Injectable()
export class EventParticipantFeatureService implements EventParticipantsServiceContract {
  constructor(
    private readonly dbUtil: EventParticipantDatabaseUtil,
    private readonly validate: AuthValidateService,
    private readonly validationUtil: EventParticipantValidationUtil,
    // private readonly messagesUtil: EventParticipantMessagesUtil,
  ) {}

  async GetUserParticipatedEvents(data: GetUserParticipatedEventsInput): Promise<PaginatedParticipatedEventsOutput> {
    const user = await this.validationUtil.checkUserExisting('by-nickname', data.nickname)
    return await this.dbUtil.getParticipatedEventsByUser(user, {
      page: data.pagination.page,
      limit: data.pagination.limit,
      search: data.pagination.search,
      status: data.pagination.status,
    })
  }

  async GetPaginatedEventParticipants(data: GetEventParticipantsInput): Promise<PaginatedEventParticipantsOutput> {
    const event = await this.validationUtil.checkEventExisting(data.slug)
    return await this.dbUtil.getEventParticipants(event, {
      page: data.pagination.page,
      limit: data.pagination.limit,
      search: data.pagination.search,
      status: data.pagination.status,
    })
  }

  async GetMyParticipatedEvents(data: GetMyParticipatedEventsInput): Promise<PaginatedParticipatedEventsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const user = await this.validationUtil.checkUserExisting('by-id', payload.id)
    return await this.dbUtil.getParticipatedEventsByUser(user, {
      page: data.pagination.page,
      limit: data.pagination.limit,
      search: data.pagination.search,
      status: data.pagination.status,
    })
  }

  async JoinEvent(data: JoinEventInput): Promise<EventParticipantOutput> {
    const payload = await this.validate.Validate(data.validation)
    return await this.dbUtil.joinToEvent(payload.id, data.slug, data.note)
  }

  async LeaveEvent(data: LeaveEventInput): Promise<EventParticipantOutput> {
    throw new Error('Method not implemented.')
  }

  async AddUserToEvent(data: AddUserToEventInput): Promise<EventParticipantOutput> {
    throw new Error('Method not implemented.')
  }

  async ChangeUserStatus(data: ChangeUserParticipantStatusInput): Promise<EventParticipantOutput> {
    throw new Error('Method not implemented.')
  }

  async RemoveUserFromEvent(data: RemoveUserFromEventInput): Promise<EventParticipantOutput> {
    throw new Error('Method not implemented.')
  }
}
