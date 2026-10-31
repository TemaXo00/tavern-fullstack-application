import { Protected } from '../../utils/protected.js'

import type {
  BlogArticleBySlugBaseInput,
  BlogArticlePaginationBaseInput,
  CreateBlogArticleBaseInput,
  UpdateBlogArticleBaseInput,
} from '@org/base-types'

export type BlogArticlePaginationGrpcInput = BlogArticlePaginationBaseInput

export type GetPaginatedBlogArticlesInput = { pagination: BlogArticlePaginationBaseInput }
export type GetMyPaginatedBlogArticles = Protected<GetPaginatedBlogArticlesInput>
export type GetBlogArticleBySlugInput = BlogArticleBySlugBaseInput
export type GetMyBlogArticleBySlugInput = Protected<GetBlogArticleBySlugInput>
export type CreateBlogArticleInput = Protected<CreateBlogArticleBaseInput>
export type PublishBlogArticleInput = Protected<BlogArticleBySlugBaseInput>
export type UnpublishBlogArticleInput = Protected<BlogArticleBySlugBaseInput>
export type UpdateBlogArticleInput = Protected<UpdateBlogArticleBaseInput>
export type DeleteBlogArticleInput = Protected<BlogArticleBySlugBaseInput>
