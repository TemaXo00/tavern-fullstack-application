import { PaginationBaseOutput } from '../../shared/pagination.type.js'

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
  authorNickname: string | null
  authorAvatarId: string | null
  tags: string[]
  isPublished: boolean
  isUpdated: boolean
  createdAt: Date
}
