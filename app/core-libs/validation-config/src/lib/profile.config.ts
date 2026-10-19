export const PROFILE_CONFIG = {
  SURNAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 90,
  },
  NICKNAME: {
    MIN_LENGHT: 3,
    MAX_LENGTH: 80,
  },
  REPUTATION_SCORE: {
    MIN: -100,
    MAX: 100,
  },
  REPUTATION_MESSAGE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 300,
  },
} as const
