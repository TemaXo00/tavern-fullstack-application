import { PaginationBaseOutput } from '../../shared/pagination.type.js'
import { BlogArticleShortBaseOutput } from '../article/article-output.data.js'

export interface BlogTagListBaseOutput {
  slug: string
  name: string
}

export type BlogTagPaginationBaseOutput = PaginationBaseOutput

export interface BlogTagBaseOutput {
  slug: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface BlogTagDetailedBaseOutput extends BlogTagBaseOutput {
  articles: BlogArticleShortBaseOutput[]
}

export interface PaginatedBlogTagsBaseOutput {
  pagination: BlogTagPaginationBaseOutput
  tags: BlogTagListBaseOutput[]
}
