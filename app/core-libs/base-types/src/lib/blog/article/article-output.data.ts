import { PaginationBaseOutput } from '../../shared/pagination.type.js'
import { BlogTagListBaseOutput } from '../tag/tag-output.data.js'

export interface BlogArticlePaginationBaseOutput extends PaginationBaseOutput {
  authorNickname?: string
  dateFrom?: Date
  dateTo?: Date
  tags?: string[]
}

export interface BlogArticleShortBaseOutput {
  slug: string
  name: string
  shortDesc: string
  authorNickname: string | null
  authorAvatarId: string | null
  isPublished: boolean
}

export interface PaginatedBlogArticlesBaseOutput {
  pagination: BlogArticlePaginationBaseOutput
  articles: BlogArticleShortBaseOutput[]
}

export interface BlogArticleBySlugBaseOutput {
  name: string
  slug: string
  shortDesc: string
  content: string
  authorId: string | null
  authorNickname: string | null
  authorAvatarId: string | null
  tags: BlogTagListBaseOutput[]
  isPublished: boolean
  isUpdated: boolean
  createdAt: Date
  updatedAt: Date
}
