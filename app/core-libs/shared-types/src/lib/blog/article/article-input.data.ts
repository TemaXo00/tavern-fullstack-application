import type {
  BlogArticlePaginationBaseInput,
  CreateBlogArticleBaseInput,
  UpdateBlogArticleBaseInput,
} from '@org/base-types'

export type BlogArticlePaginationSharedInput = BlogArticlePaginationBaseInput
export type CreateBlogArticleSharedInput = CreateBlogArticleBaseInput
export type UpdateBlogArticleSharedInput = Omit<UpdateBlogArticleBaseInput, 'slug'>
