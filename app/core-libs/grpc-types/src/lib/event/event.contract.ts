import { Empty } from '../shared/empty.type.js'
import { ToObservable } from '../utils/to-observable.js'
import {
  CancelEventInput,
  ChangeLockInput,
  CreateEventInput,
  DeleteEventInput,
  DeleteOtherEventInput,
  FinishEventInput,
  GetPrivateEventBySlug,
  GetPrivateUserEventsInput,
  GetPublicEventBySlug,
  GetPublicUserEventsInput,
  PaginatedPrivateEventsInput,
  PaginatedPublicEventsInput,
  PublishEventInput,
  SwitchOrganizerInput,
  UpdateEventDataInput,
} from './events/event-input.data.js'
import {
  EventMethodsOutput,
  EventOutput,
  PaginatedPrivateEventsOutput,
  PaginatedPublicEventsOutput,
} from './events/event-output.data.js'
import {
  AddUserToEventInput,
  ChangeUserParticipantStatusInput,
  GetEventParticipantsInput,
  GetMyParticipatedEventsInput,
  GetUserParticipatedEventsInput,
  JoinEventInput,
  LeaveEventInput,
  RemoveUserFromEventInput,
} from './participant/participant-input.data.js'
import {
  PaginatedEventParticipantsOutput,
  PaginatedParticipatedEventsOutput,
  EventParticipantOutput,
} from './participant/participant-output.data.js'
import {
  CreateEventTagInput,
  DeleteEventTagInput,
  GetEventTagInput,
  GetPaginatedEventTagsInput,
  UpdateEventTagInput,
} from './tag/tag-input.data.js'
import { EventTagDetailedOutput, EventTagOutput, PaginatedEventTagsOutput } from './tag/tag-output.data.js'

export interface EventTagServiceContract {
  GetPaginatedTags(data: GetPaginatedEventTagsInput): Promise<PaginatedEventTagsOutput>
  GetTagBySlug(data: GetEventTagInput): Promise<EventTagDetailedOutput>
  CreateTag(data: CreateEventTagInput): Promise<EventTagOutput>
  UpdateTag(data: UpdateEventTagInput): Promise<EventTagOutput>
  DeleteTag(data: DeleteEventTagInput): Promise<Empty>
}

export interface EventEventsServiceContract {
  GetPublicEvents(data: PaginatedPublicEventsInput): Promise<PaginatedPublicEventsOutput>
  GetPrivateEvents(data: PaginatedPrivateEventsInput): Promise<PaginatedPrivateEventsOutput>
  GetMyEvents(data: PaginatedPrivateEventsInput): Promise<PaginatedPrivateEventsOutput>
  GetPublicUserEvents(data: GetPublicUserEventsInput): Promise<PaginatedPublicEventsOutput>
  GetPrivateUserEvents(data: GetPrivateUserEventsInput): Promise<PaginatedPrivateEventsOutput>
  GetPublicEventBySlug(data: GetPublicEventBySlug): Promise<EventOutput>
  GetPrivateEventBySlug(data: GetPrivateEventBySlug): Promise<EventOutput>
  GetMyEventBySlug(data: GetPrivateEventBySlug): Promise<EventOutput>
  CreateEvent(data: CreateEventInput): Promise<EventMethodsOutput>
  PublishEvent(data: PublishEventInput): Promise<EventMethodsOutput>
  CancelEvent(data: CancelEventInput): Promise<EventMethodsOutput>
  FinishEvent(data: FinishEventInput): Promise<EventMethodsOutput>
  ChangeLock(data: ChangeLockInput): Promise<EventMethodsOutput>
  SwitchOrganizer(data: SwitchOrganizerInput): Promise<EventMethodsOutput>
  SwitchOtherEventOrganizer(data: SwitchOrganizerInput): Promise<EventMethodsOutput>
  UpdateEvent(data: UpdateEventDataInput): Promise<EventMethodsOutput>
  DeleteEvent(data: DeleteEventInput): Promise<EventMethodsOutput>
  DeleteOtherEvent(data: DeleteOtherEventInput): Promise<EventMethodsOutput>
}

export interface EventParticipantsServiceContract {
  GetUserParticipatedEvents(data: GetUserParticipatedEventsInput): Promise<PaginatedParticipatedEventsOutput>
  GetPaginatedEventParticipants(data: GetEventParticipantsInput): Promise<PaginatedEventParticipantsOutput>
  GetMyParticipatedEvents(data: GetMyParticipatedEventsInput): Promise<PaginatedParticipatedEventsOutput>
  JoinEvent(data: JoinEventInput): Promise<EventParticipantOutput>
  LeaveEvent(data: LeaveEventInput): Promise<EventParticipantOutput>
  AddUserToEvent(data: AddUserToEventInput): Promise<EventParticipantOutput>
  ChangeUserStatus(data: ChangeUserParticipantStatusInput): Promise<EventParticipantOutput>
  RemoveUserFromEvent(data: RemoveUserFromEventInput): Promise<EventParticipantOutput>
}

export type EventTagServiceObservableContract = ToObservable<EventTagServiceContract>
export type EventEventsServiceObservableContract = ToObservable<EventEventsServiceContract>
export type EventParticipantsServiceObservableContract = ToObservable<EventParticipantsServiceContract>
