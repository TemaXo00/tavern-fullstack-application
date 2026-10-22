import { EventStatuses, ParticipantStatuses } from '@org/enums'

import { Replace } from '../../utils/replace.js'

import type {
  EventParticipantBaseOutput,
  EventParticipantPaginationBaseOutput,
  ParticipantInPaginatedBaseOutput,
  ParticipatedEventBaseOutput,
  ParticipatedEventsPaginationBaseOutput,
} from '@org/base-types'

export type ParticipatedEventsPaginationSharedOutput = Replace<
  ParticipatedEventsPaginationBaseOutput,
  { status?: EventStatuses }
>
export type EventParticipantPaginationSharedOutput = Replace<
  EventParticipantPaginationBaseOutput,
  { status?: ParticipantStatuses }
>

export type EventParticipantSharedOutput = Replace<
  EventParticipantBaseOutput,
  {
    status: ParticipantStatuses
  }
>

export type ParticipatedEventSharedOutput = Replace<
  ParticipatedEventBaseOutput,
  {
    status: EventStatuses
  }
>

export type ParticipantInPaginatedSharedOutput = ParticipantInPaginatedBaseOutput

export interface PaginatedEventParticipantsSharedOutput {
  event: ParticipatedEventSharedOutput
  pagination: EventParticipantPaginationSharedOutput
  participants: EventParticipantSharedOutput[]
}

export interface PaginatedParticipatedEventsSharedOutput {
  participant: ParticipantInPaginatedSharedOutput
  pagination: ParticipatedEventsPaginationSharedOutput
  events: ParticipatedEventSharedOutput[]
}
