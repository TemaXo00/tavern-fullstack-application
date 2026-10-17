import { PaginationBaseInput } from '../../shared/pagination.type.js'

export type EventTagPaginationBaseInput = PaginationBaseInput
export interface GetPaginatedEventTagsBaseInput {
  pagination: EventTagPaginationBaseInput
}

export interface EventTagBySlugBaseInput {
  slug: string
}

export interface CreateEventTagBaseInput {
  name: string
  description?: string
  color?: string
}

export interface UpdateEventTagBaseInput {
  description?: string
  color?: string
}
