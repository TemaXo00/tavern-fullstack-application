import { PaginationBaseInput } from '../../shared/pagination.type.js'

export type BlogTagPaginationBaseInput = PaginationBaseInput

export interface BlogTagBySlugBaseInput {
  slug: string
}

export interface CreateBlogTagBaseInput {
  name: string
}
