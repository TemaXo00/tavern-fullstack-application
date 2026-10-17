import { PaginationBaseOutput } from '../../shared/pagination.type.js'

export interface EventPublicPaginationBaseOutput extends PaginationBaseOutput {
  dateFrom?: Date
  dateTo?: Date
  leftPlacesFrom?: number
  leftPlacesTo?: number
  tags?: string[]
}

export interface EventPrivatePaginationBaseOutput extends EventPublicPaginationBaseOutput {
  totalPlacesFrom?: number
  totalPlacesTo?: number
  status?: number
}

export interface EventUserShortBaseOutput {
  nickname: string
  avatarId: string | null
}

export interface EventTagShortBaseOutput {
  slug: string
  name: string
  color: string | null
}

export interface EventListBaseOutput {
  slug: string
  name: string
  dateAndTime: Date
  leftPlaces: number
  waitingUsers: number
  status: number
  organizer: EventUserShortBaseOutput
  tags: EventTagShortBaseOutput[]
}

export interface EventBaseOutput {
  slug: string
  name: string
  description?: string
  dateAndTime: Date
  totalPlaces: number
  leftPlaces: number
  waitingUsers: number
  status: number
  tags: EventTagShortBaseOutput[]
  organizer: EventUserShortBaseOutput
  participants: EventUserShortBaseOutput[]
  createdAt: Date
}

export interface EventMethodsBaseOutput {
  slug: string
  name: string
  description?: string
  dateAndTime: Date
  totalPlaces: number
  leftPlaces: number
  waitingUsers: number
  status: number
  organizerId: string
}

export interface PaginatedPublicEventsBaseOutput {
  pagination: EventPublicPaginationBaseOutput
  events: EventListBaseOutput[]
}

export interface PaginatedPrivateEventsBaseOutput {
  pagination: EventPrivatePaginationBaseOutput
  events: EventListBaseOutput[]
}
