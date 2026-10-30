import { UpdateBlogArticleSharedInput } from '@org/shared-types'

import { ArticleContent } from '../../decorators/blog/article-content.decorator.js'
import { BlogTags } from '../../decorators/blog/blog-tags.decorator.js'
import { Description } from '../../decorators/shared/description.decorator.js'

export class UpdateBlogArticleDto implements UpdateBlogArticleSharedInput {
  @Description(false)
  shortDesc?: string

  @ArticleContent(false)
  content?: string

  @BlogTags(false)
  tags?: string[]
}
