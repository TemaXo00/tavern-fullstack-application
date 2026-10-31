export interface BlogTagCreatedMessage {
  adminId: string
  tagSlug: string
}

export interface BlogTagDeletedMessage {
  adminId: string
  tagSlug: string
}
