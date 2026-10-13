export const AUTH_AUTHORIZATION_ROUTES = {
  BASE_URL: 'auth/authorization',
  REGISTER: 'register',
  LOGIN: 'login',
  REFRESH: 'refresh',
  LOGOUT: 'logout',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: {
    PATH: 'reset-password/:token',
    PARAM: 'token',
  },
  GET_ME: 'me',
} as const;

export const AUTH_SESSION_ROUTES = {
  BASE_URL: 'auth/session',
  GET_BY_USER: {
    PATH: 'user/:id',
    PARAM: 'id',
  },
  GET_MY_SESSIONS: 'me',
  CHANGE_LOCAL_NAME: 'me/local-name',
  DELETE_SESSION_BY_ID: {
    PATH: 'me/session/:id',
    PARAM: 'id',
  },
  DELETE_ALL_SESSIONS: 'me/session',
};

export const AUTH_TOKEN_ROUTES = {
  BASE_URL: 'auth/token',
  GET_WITH_PAGINATION: '',
  GET_BY_ID: {
    PATH: ':id',
    PARAM: 'id',
  },
  REVOKE: {
    PATH: ':id/revoke',
    PARAM: 'id',
  },
  REMOVE: {
    PATH: ':id/remove',
    PARAM: 'id',
  },
  REMOVE_INACTIVE: 'inactive',
};

export const AUTH_USER_ROUTES = {
  BASE_URL: 'auth/user',
  GET_PAGINATED: '',
  GET_BY_ID: {
    PATH: ':id',
    PARAM: 'id',
  },
  CHANGE_EMAIL: 'me/email',
  CHANGE_PASSWORD: 'me/password',
  SET_INACTIVE: 'me/inactive',
  BLOCK: {
    PATH: ':id/block',
    PARAM: 'id',
  },
  UNBLOCK: {
    PATH: ':id/unblock',
    PARAM: 'id',
  },
  PROMOTE: {
    PATH: ':id/promote',
    PARAM: 'id',
  },
  DEMOTE: {
    PATH: ':id/demote',
    PARAM: 'id',
  },
  ACTIVE: {
    PATH: ':id/active',
    PARAM: 'id',
  },
  DELETE: 'me/delete',
};
