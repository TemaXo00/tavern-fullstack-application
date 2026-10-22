import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { EventParticipantFeatureService } from './event-participant-feature.service'

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
  ParticipantOutput,
  RemoveUserFromEventInput,
} from '@org/grpc-types'

@Controller()
export class EventParticipantFeatureController implements EventParticipantsServiceContract {
  constructor(private readonly service: EventParticipantFeatureService) {}

  @GrpcMethod('ParticipantService', 'GetUserParticipatedEvents')
  async GetUserParticipatedEvents(data: GetUserParticipatedEventsInput): Promise<PaginatedParticipatedEventsOutput> {
    return await this.service.GetUserParticipatedEvents(data)
  }

  @GrpcMethod('ParticipantService', 'GetPaginatedEventParticipants')
  async GetPaginatedEventParticipants(data: GetEventParticipantsInput): Promise<PaginatedEventParticipantsOutput> {
    return await this.service.GetPaginatedEventParticipants(data)
  }

  @GrpcMethod('ParticipantService', 'GetMyParticipatedEvents')
  async GetMyParticipatedEvents(data: GetMyParticipatedEventsInput): Promise<PaginatedParticipatedEventsOutput> {
    return await this.service.GetMyParticipatedEvents(data)
  }

  @GrpcMethod('ParticipantService', 'JoinEvent')
  async JoinEvent(data: JoinEventInput): Promise<ParticipantOutput> {
    return await this.service.JoinEvent(data)
  }

  @GrpcMethod('ParticipantService', 'LeaveEvent')
  async LeaveEvent(data: LeaveEventInput): Promise<ParticipantOutput> {
    return await this.service.LeaveEvent(data)
  }

  @GrpcMethod('ParticipantService', 'AddUserToEvent')
  async AddUserToEvent(data: AddUserToEventInput): Promise<ParticipantOutput> {
    return await this.service.AddUserToEvent(data)
  }

  @GrpcMethod('ParticipantService', 'ChangeUserStatus')
  async ChangeUserStatus(data: ChangeUserParticipantStatusInput): Promise<ParticipantOutput> {
    return await this.service.ChangeUserStatus(data)
  }

  @GrpcMethod('ParticipantService', 'RemoveUserFromEvent')
  async RemoveUserFromEvent(data: RemoveUserFromEventInput): Promise<ParticipantOutput> {
    return await this.service.RemoveUserFromEvent(data)
  }
}
