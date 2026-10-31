import { TagGetPayload } from '@org/blog-database'
import { BlogTagDetailedOutput } from '@org/grpc-types'

import { TAG_ADVANCED_OUTPUT_SELECTIONS } from './selections'

export function mapDetailedTagOutput(
  response: TagGetPayload<{
    select: typeof TAG_ADVANCED_OUTPUT_SELECTIONS
  }> | null,
): BlogTagDetailedOutput | null {
  if (response === null) {
    return null
  }
  return {
    name: response.name,
    slug: response.slug,
    createdAt: response.createdAt,
    articles: response.articles.map((article) => {
      return {
        name: article.name,
        slug: article.slug,
        shortDesc: article.shortDesc,
        authorNickname: article.author ? article.author.nickname : null,
        authorAvatarId: article.author ? article.author.avatarId : null,
      }
    }),
  }
}
