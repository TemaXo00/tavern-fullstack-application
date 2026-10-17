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

export const EVENT_EVENTS_ROUTES = {
  BASE_URL: 'event/event',
  GET_PUBLIC_PAGINATED: 'public',
  GET_PRIVATE_PAGINATED: 'private',
  GET_MY_PAGINATED: 'me',
  GET_PUBLIC_BY_USER: {
    PATH: 'user/public/:nickname',
    PARAM: 'nickname',
  },
  GET_PRIVATE_BY_USER: {
    PATH: 'user/private/:nickname',
    PARAM: 'nickname',
  },
  GET_PUBLIC_BY_SLUG: {
    PATH: 'public/:slug',
    PARAM: 'slug',
  },
  GET_PRIVATE_BY_SLUG: {
    PATH: 'private/:slug',
    PARAM: 'slug',
  },
  GET_MY_BY_SLUG: {
    PATH: 'me/:slug',
    PARAM: 'slug',
  },
  CREATE: '',
  PUBLISH: {
    PATH: ':slug/publish',
    PARAM: 'slug',
  },
  CANCEL: {
    PATH: ':slug/cancel',
    PARAM: 'slug',
  },
  FINISH: {
    PATH: ':slug/finish',
    PARAM: 'slug',
  },
  SWITCH_ORGANIZER: {
    PATH: 'me/:slug/organizer',
    PARAM: 'slug',
  },
  SWITCH_OTHER_EVENT_ORGANIZER: {
    PATH: ':slug/organizer',
    PARAM: 'slug',
  },
  UPDATE: {
    PATH: ':slug',
    PARAM: 'slug',
  },
  DELETE: {
    PATH: 'me/:slug',
    PARAM: 'slug',
  },
  DELETE_OTHER: {
    PATH: 'other/:slug',
    PARAM: 'slug',
  },
} as const;
