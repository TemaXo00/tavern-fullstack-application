export const PROFILE_CONFIG = {
  DESCRIPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 90,
  },
  SURNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 90,
  },
  NICKNAME: {
    MIN_LENGHT: 3,
    MAX_LENGTH: 80,
  },
} as const;
