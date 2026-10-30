import { CreateBlogArticleSharedInput } from '@org/shared-types'

import { ArticleContent } from '../../decorators/blog/article-content.decorator.js'
import { IsAnonim } from '../../decorators/blog/article-is-anonim.decorator.js'
import { BlogTags } from '../../decorators/blog/blog-tags.decorator.js'
import { Description } from '../../decorators/shared/description.decorator.js'
import { Name } from '../../decorators/shared/name.decorator.js'

export class CreateBlogArticleDto implements CreateBlogArticleSharedInput {
  @Name()
  name: string
  @Description()
  shortDesc: string
  @ArticleContent()
  content: string
  @BlogTags()
  tags: string[]
  @IsAnonim({ required: true })
  isAnonim: boolean
}
