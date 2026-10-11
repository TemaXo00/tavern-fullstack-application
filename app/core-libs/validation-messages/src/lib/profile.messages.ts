export const PROFILE_MESSAGES = {
  UPDATE_ACITIVITY_WARNING: {
    CONTEXT: 'Update Activity',
    MESSAGE: 'Cannot find user',
  },
  CREATE_EXISTING_WARNING: {
    CONTEXT: 'CreateProfile',
    METHOD: 'Register',
    MESSAGE: 'User exists but has no activity log, repairing',
  },
  BLOCK_USER: {
    LOG_METHOD: 'Block',
    MESSAGE: (dateFrom: Date, dateTo: Date, reason: string): string => {
      return `The user blocked from ${dateFrom.toISOString()} to ${dateTo.toISOString()}. Reason: ${reason}`;
    },
  },
  EARLY_UNBLOCK: {
    LOG_METHOD: 'Early Unblock',
    MESSAGE: 'The user has been unblocked due to changed circumstances',
  },
  ACTIVATE_USER: 'Activate user',
  DEACTIVATE_USER: 'Deactivate user',
  REPUTATION_UNKNOWN_TYPE: 'Unknown action type',
  PROFILE_NOT_FOUND: 'Profile not found',
  NICKNAME_TAKEN: 'Nickname already taken',
  BIRTH_DATE_FUTURE: 'Birth date from cannot be in future',
  BIRTH_DATE_FROM_FEWER: 'Birth date from cannot be fewer, than birthDateTo',
  UPDATE_PROFILE_DATA_NOT_FOUND: 'Invalid update data',
  REPUTATION_FROM_BIGGER: 'Reputation from cannot be more than reputation to',
} as const;
