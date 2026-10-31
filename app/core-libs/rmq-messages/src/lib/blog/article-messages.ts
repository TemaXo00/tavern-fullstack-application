export interface BlogArticleCreatedMessage {
  authorId: string
  isAnonim: boolean
  slug: string
}

export interface BlogArticleChangeStatusMessage {
  authorId: string | null
  slug: string
  status: 'PUBLISHED' | 'UNPUBLISHED'
}

export interface BlogArticleUpdateMessage {
  authorId: string | null
  slug: string
}

export interface BlogArticleDeleteMessage {
  adminId: string
  slug: string
}
