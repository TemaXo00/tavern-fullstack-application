export const AUTH_CONFIG = {
  PASSWORD: {
    MIN_LENGHT: 8,
    MIN_LOWERCASE: 1,
    MIN_UPPERCASE: 1,
    MIN_NUMBERS: 1,
    MIN_SYMBOLS: 0,
  },
  BLOCK_REASON: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 800,
  },
  LOCAL_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 90,
  },
  EMAIL: {
    MIN_LENGTH: 3,
    ALLOW_IP_DOMAINS: false,
  },
  BLOCK: {
    MAX_DATE_YEAR: 10,
  },
  SESSION: {
    DELETE_PERMISSION_DAYS: 1,
  },
  TOKEN: {
    EXPIRE_DAYS: 1,
  },
} as const
