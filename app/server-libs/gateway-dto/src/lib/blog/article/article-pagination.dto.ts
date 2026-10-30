import { BlogArticlePaginationSharedInput } from '@org/shared-types'

import { BlogDate } from '../../decorators/blog/blog-date.decorator.js'
import { BlogTags } from '../../decorators/blog/blog-tags.decorator.js'
import { Nickname } from '../../decorators/shared/nickname.decorator.js'
import { BasePaginationDto } from '../../shared/pagination-base.dto.js'

export class BlogArticlePaginationDto extends BasePaginationDto implements BlogArticlePaginationSharedInput {
  @BlogDate(false)
  dateFrom?: Date

  @BlogDate(false)
  dateTo?: Date

  @Nickname(false)
  authorNickname?: string

  @BlogTags(false)
  tags?: string[]
}
