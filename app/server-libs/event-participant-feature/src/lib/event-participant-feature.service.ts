import { Injectable } from '@nestjs/common'

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
  async GetUserParticipatedEvents(data: GetUserParticipatedEventsInput): Promise<PaginatedParticipatedEventsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetPaginatedEventParticipants(data: GetEventParticipantsInput): Promise<PaginatedEventParticipantsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetMyParticipatedEvents(data: GetMyParticipatedEventsInput): Promise<PaginatedParticipatedEventsOutput> {
    throw new Error('Method not implemented.')
  }

  async JoinEvent(data: JoinEventInput): Promise<EventParticipantOutput> {
    throw new Error('Method not implemented.')
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
