export const BLOG_TAGS_ROUTES = {
  BASE_URL: 'blog/tag',
  GET_PAGINATED_TAGS: '',
  GET_TAG_BY_SLUG: {
    PATH: ':slug',
    PARAM: 'slug',
  },
  CREATE: '',
  DELETE: {
    PATH: ':slug',
    PARAM: 'slug',
  },
}

export const BLOG_ARTICLE_ROUTES = {
  BASE_URL: 'blog/article',
  GET_PAGINATED_ARTICLES: 'public',
  GET_MY_PAGINATION_ARTICLES: 'me',
  GET_ARTICLE_BY_SLUG: {
    PATH: 'public/:slug',
    PARAM: 'slug',
  },
  GET_MY_ARTICLE_BY_SLUG: {
    PATH: 'me/:slug',
    PARAM: 'slug',
  },
  CREATE: '',
  UPDATE: {
    PATH: ':slug',
    PARAM: 'slug',
  },
  PUBLISH: {
    PATH: ':slug/publish',
    PARAM: 'slug',
  },
  UNPUBLISH: {
    PATH: ':slug/unpublish',
    PARAM: 'slug',
  },
  DELETE: {
    PATH: ':slug',
    PARAM: 'slug',
  },
}
