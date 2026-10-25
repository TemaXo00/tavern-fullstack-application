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
  note?: string
}

export interface LeaveEventBaseInput {
  slug: string
}

export interface AddUserToEventBaseInput {
  slug: string
  nickname: string
}

export interface ChangeUserParticipantStatusBaseInput {
  slug: string
  nickname: string
  status: number
}

export interface RemoveUserFromEventBaseInput {
  slug: string
  nickname: string
}
