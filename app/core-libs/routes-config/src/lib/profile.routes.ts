export const PROFILE_PROFILE_ROUTES = {
  BASE_URL: 'profile/profile',
  GET_ME: 'me',
  UPDATE_ME: 'me',
  GET_BY_NICKNAME_BASE: {
    PATH: ':nickname/base',
    PARAM: 'nickname',
  },
  GET_BY_NICKNAME_ADVANCED: {
    PATH: ':nickname/advanced',
    PARAM: 'nickname',
  },
  GET_PROFILES_BASE: 'base',
  GET_PROFILES_ADVANCED: 'advanced',
} as const

export const PROFILE_ACTIVITY_ROUTES = {
  BASE_URL: 'profile/activity',
  GET_ME: 'me',
  GET_BY_NICKNAME: {
    PATH: ':nickname/logs',
    PARAM: 'nickname',
  },
} as const

export const PROFILE_REPUTATION_ROUTES = {
  BASE_URL: 'profile/reputation',
  GET_ME: 'me',
  GET_BY_NICKNAME: {
    PATH: ':nickname/logs',
    PARAM: 'nickname',
  },
  ADD_REPUTATION_SCORE: {
    PATH: ':nickname/change',
    PARAM: 'nickname',
  },
} as const

export const PROFILE_SOCIALS_ROUTES = {
  BASE_URL: 'profile/social',
  GET_ME: 'me',
  GET_BY_NICKNAME: {
    PATH: ':nickname',
    PARAM: 'nickname',
  },
  CREATE: '',
  DELETE: {
    PATH: ':id',
    PARAM: 'id',
  },
} as const
