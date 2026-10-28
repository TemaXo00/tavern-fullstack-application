import { Protected } from '../../utils/protected.js'

import type { BlogTagBySlugBaseInput, BlogTagPaginationBaseInput, CreateBlogTagBaseInput } from '@org/base-types'

export type BlogTagPaginationInput = BlogTagPaginationBaseInput
export type GetBlogTagInput = BlogTagBySlugBaseInput
export type CreateBlogTagInput = Protected<CreateBlogTagBaseInput>
export type DeleteBlogTagInput = Protected<BlogTagBySlugBaseInput>
