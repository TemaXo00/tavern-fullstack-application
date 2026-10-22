import { EventStatuses, ParticipantStatuses } from '@org/enums'

import { Replace } from '../../utils/replace.js'

import type {
  AddUserToEventBaseInput,
  ChangeUserParticipantStatusBaseInput,
  EventParticipantPaginationBaseInput,
  ParticipatedEventsPaginationBaseInput,
  RemoveUserFromEventBaseInput,
} from '@org/base-types'

export type ParticipatedEventsPaginationSharedInput = Replace<
  ParticipatedEventsPaginationBaseInput,
  {
    status?: EventStatuses
  }
>

export type EventParticipantPaginationSharedInput = Replace<
  EventParticipantPaginationBaseInput,
  {
    status?: ParticipantStatuses
  }
>

export type AddUserToEventSharedInput = Omit<AddUserToEventBaseInput, 'slug'>

export type ChangeUserParticipantStatusSharedInput = Replace<
  Omit<ChangeUserParticipantStatusBaseInput, 'slug'>,
  {
    status: ParticipantStatuses
  }
>

export type RemoveUserFromEventSharedInput = Omit<RemoveUserFromEventBaseInput, 'slug'>
