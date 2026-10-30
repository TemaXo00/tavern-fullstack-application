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
  GET_PAGINATED_ARTICLES: '',
}
