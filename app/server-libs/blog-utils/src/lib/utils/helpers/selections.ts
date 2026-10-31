import { TagSelect } from '@org/blog-database'

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
    select: {
      slug: true,
      name: true,
      shortDesc: true,
      author: {
        select: {
          nickname: true,
          avatarId: true,
        },
      },
    },
    orderBy: [{ createdAt: 'asc' }, { slug: 'asc' }],
  },
} as const satisfies TagSelect

export const BLOG_TAG_BASE_SELECTIONS = {
  name: true,
  slug: true,
  createdAt: true,
} as const satisfies TagSelect
