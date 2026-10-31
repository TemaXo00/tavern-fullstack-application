import { ArticleGetPayload, TagGetPayload } from '@org/blog-database'
import { BlogArticleBySlugOutput, BlogArticleListGrpcOutput, BlogTagDetailedOutput } from '@org/grpc-types'

import {
  BLOG_ARTICLE_BY_SLUG_SELECTIONS,
  BLOG_ARTICLE_LIST_SELECTIONS,
  TAG_ADVANCED_OUTPUT_SELECTIONS,
} from './selections'

export function mapArticleListOutput(
  articles: ArticleGetPayload<{
    select: typeof BLOG_ARTICLE_LIST_SELECTIONS
  }>[],
): BlogArticleListGrpcOutput[] {
  return articles.map((article) => {
    return {
      slug: article.slug,
      name: article.name,
      shortDesc: article.shortDesc,
      isPublished: article.isPublished,
      authorNickname: article.author ? article.author.nickname : null,
      authorAvatarId: article.author ? article.author.avatarId : null,
    }
  })
}

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
    articles: mapArticleListOutput(response.articles),
  }
}

export function mapArticleBySlugOutput(
  response: ArticleGetPayload<{ select: typeof BLOG_ARTICLE_BY_SLUG_SELECTIONS }>,
): BlogArticleBySlugOutput {
  return {
    name: response.name,
    slug: response.slug,
    shortDesc: response.shortDesc,
    content: response.content,
    tags: response.tags,
    authorId: response.authorId,
    isPublished: response.isPublished,
    isUpdated: response.isUpdated,
    authorNickname: response.author ? response.author.nickname : null,
    authorAvatarId: response.author ? response.author.avatarId : null,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt
  }
}
