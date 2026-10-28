import { PaginationBaseInput } from '../../shared/pagination.type.js'

export interface BlogArticlePaginationBaseInput extends PaginationBaseInput {
  authorNickname?: string
  dateFrom?: Date
  dateTo?: Date
  tags?: string[]
}

export interface BlogArticleBySlugBaseInput {
  slug: string
}

export interface CreateBlogArticleBaseInput {
  name: string
  shortDesc: string
  content: string
  tags: string[]
  isAnonim: boolean
}

export interface UpdateBlogArticleBaseInput extends BlogArticleBySlugBaseInput {
  shortDesc?: string
  content?: string
  tags?: string[]
}
