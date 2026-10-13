export const EVENT_TAG_ROUTES = {
  BASE_URL: 'event/tag',
  GET_PAGINATED: '',
  GET_BY_SLUG: {
    PATH: ':slug',
    PARAM: 'slug',
  },
  CREATE: '',
  UPDATE: {
    PATH: ':slug',
    PARAM: 'slug',
  },
  DELETE: {
    PATH: ':slug',
    PARAM: 'slug',
  },
} as const;
