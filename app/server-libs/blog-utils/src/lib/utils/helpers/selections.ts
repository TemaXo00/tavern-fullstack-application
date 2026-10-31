import { ArticleSelect, TagSelect, UserSnapshotSelect } from '@org/blog-database'

export const AUTHOR_SELECTIONS = {
  nickname: true,
  avatarId: true,
} as const satisfies UserSnapshotSelect

export const BLOG_ARTICLE_LIST_SELECTIONS = {
  slug: true,
  name: true,
  shortDesc: true,
  isPublished: true,
  author: {
    select: AUTHOR_SELECTIONS,
  },
} as const satisfies ArticleSelect

export const TAG_LIST_OUTPUT_SELECTION = {
  name: true,
  slug: true,
} as const satisfies TagSelect

export const TAG_ADVANCED_OUTPUT_SELECTIONS = {
  slug: true,
  name: true,
  createdAt: true,
  articles: {
    take: 5,
    where: { isPublished: true },
    select: BLOG_ARTICLE_LIST_SELECTIONS,
    orderBy: [{ createdAt: 'asc' }, { slug: 'asc' }],
  },
} as const satisfies TagSelect

export const BLOG_TAG_BASE_SELECTIONS = {
  name: true,
  slug: true,
  createdAt: true,
} as const satisfies TagSelect

export const BLOG_ARTICLE_BY_SLUG_SELECTIONS = {
  name: true,
  slug: true,
  shortDesc: true,
  content: true,
  authorId: true,
  author: {
    select: AUTHOR_SELECTIONS,
  },
  tags: {
    select: TAG_LIST_OUTPUT_SELECTION,
  },
  isPublished: true,
  isUpdated: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies ArticleSelect
