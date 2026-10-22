import { Protected } from '../../utils/protected.js'

import type {
  AddUserToEventBaseInput,
  ChangeUserParticipantStatusBaseInput,
  EventParticipantPaginationBaseInput,
  GetEventParticipantsBaseInput,
  GetMyParticipatedEventsBaseInput,
  GetUserParticipatedEventsBaseInput,
  JoinEventBaseInput,
  LeaveEventBaseInput,
  ParticipatedEventsPaginationBaseInput,
  RemoveUserFromEventBaseInput,
} from '@org/base-types'

export type ParticipatedEventsPaginationGrpcInput = ParticipatedEventsPaginationBaseInput
export type EventParticipantPaginationGrpcInput = EventParticipantPaginationBaseInput
export type ChangeUserParticipantStatusGrpcInput = Omit<ChangeUserParticipantStatusBaseInput, 'slug'>

export type GetUserParticipatedEventsInput = GetUserParticipatedEventsBaseInput
export type GetMyParticipatedEventsInput = Protected<GetMyParticipatedEventsBaseInput>
export type GetEventParticipantsInput = GetEventParticipantsBaseInput
export type JoinEventInput = Protected<JoinEventBaseInput>
export type LeaveEventInput = Protected<LeaveEventBaseInput>
export type AddUserToEventInput = Protected<AddUserToEventBaseInput>
export type ChangeUserParticipantStatusInput = Protected<ChangeUserParticipantStatusBaseInput>
export type RemoveUserFromEventInput = Protected<RemoveUserFromEventBaseInput>
