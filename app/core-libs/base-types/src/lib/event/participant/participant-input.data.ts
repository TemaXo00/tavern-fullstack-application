import { PaginationBaseInput } from '../../shared/pagination.type.js'

export interface ParticipatedEventsPaginationBaseInput extends PaginationBaseInput {
  status?: number
}

export interface EventParticipantPaginationBaseInput extends PaginationBaseInput {
  status?: number
}

export interface GetUserParticipatedEventsBaseInput {
  nickname: string
  pagination: ParticipatedEventsPaginationBaseInput
}

export interface GetMyParticipatedEventsBaseInput {
  pagination: ParticipatedEventsPaginationBaseInput
}

export interface GetEventParticipantsBaseInput {
  slug: string
  pagination: EventParticipantPaginationBaseInput
}

export interface JoinEventBaseInput {
  slug: string
}

export interface LeaveEventBaseInput {
  slug: string
}

export interface AddUserToEventBaseInput {
  nickname: string
}

export interface ChangeUserParticipantStatusBaseInput {
  nickname: string
  status: number
}

export interface RemoveUserFromEventBaseInput {
  nickname: string
}
