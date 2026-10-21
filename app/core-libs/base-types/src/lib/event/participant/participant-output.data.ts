import { PaginationBaseOutput } from '../../shared/pagination.type.js'

export interface ParticipatedEventsPaginationBaseOutput extends PaginationBaseOutput {
  status?: number
}

export interface EventParticipantPaginationBaseOutput extends PaginationBaseOutput {
  status?: number
}

export interface ParticipatedEventBaseOutput {
  slug: string
  name: string
  dateAndTime: Date
  status: number
}

export interface EventParticipantBaseOutput {
  nickname: string
  avatarId: string | null
  isFixed: boolean
  note: string | null
  status: number
}

export interface ParticipantInPaginatedBaseOutput {
  nickname: string
  avatarId: string | null
}

export interface PaginatedEventParticipantsBaseOutput {
  event: ParticipatedEventBaseOutput
  pagination: EventParticipantPaginationBaseOutput
  participants: EventParticipantBaseOutput[]
}

export interface PaginatedParticipatedEventsBaseOutput {
  participant: ParticipantInPaginatedBaseOutput
  pagination: ParticipatedEventsPaginationBaseOutput
  events: ParticipatedEventBaseOutput[]
}
