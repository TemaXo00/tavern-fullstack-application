import { PaginationBaseInput } from '../../shared/pagination.type.js'

export interface EventPublicPaginationBaseInput extends PaginationBaseInput {
  isJoinBlocked?: boolean
  dateFrom?: Date
  dateTo?: Date
  leftPlacesFrom?: number
  leftPlacesTo?: number
  tags?: string[]
}

export interface EventPrivatePaginationBaseInput extends EventPublicPaginationBaseInput {
  totalPlacesFrom?: number
  totalPlacesTo?: number
  status?: number
}

export interface PaginatedPublicEventsBaseInput {
  pagination: EventPublicPaginationBaseInput
}

export interface PaginatedPrivateEventsBaseInput {
  pagination: EventPrivatePaginationBaseInput
}

export interface GetPublicUserEventsBaseInput {
  pagination: EventPublicPaginationBaseInput
  nickname: string
}

export interface GetPrivateUserEventsBaseInput {
  pagination: EventPrivatePaginationBaseInput
  nickname: string
}

export interface GetEventBySlugBaseInput {
  slug: string
}

export interface CreateEventBaseInput {
  name: string
  description?: string
  dateAndTime: Date
  totalPlaces: number
  tags: string[]
}

export interface EventActionBaseInput {
  slug: string
}

export interface SwitchEventOrganizerBaseInput {
  slug: string
  organizerNickname: string
}

export interface UpdateEventDataBaseInput {
  slug: string
  description?: string
  dateAndTime?: Date
  totalPlaces?: number
  tags: string[]
}

export interface DeleteOtherEventBaseInput extends EventActionBaseInput {
  message: string
}
