import { Actions, ActivityType } from '@org/enums';
import { PROFILE_CONFIG } from '@org/validation-config';

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
  CREATE: {
    CONTEXT: 'Create Profile',
    MESSAGE: (userId: string): string => {
      return `userId: ${userId}`;
    },
  },
  UNBLOCK: {
    CONTEXT: 'Update Status',
    MESSAGE: (userId: string): string => {
      return `User: ${userId}`;
    },
  },
  INACTIVE: {
    CONTEXT: 'Update activity',
    MESSAGE: (userId: string): string => {
      return `User with ID ${userId} deactivated`;
    },
  },
  BLOCK_USER: {
    LOG_METHOD: 'Block',
    MESSAGE: (dateFrom: Date, dateTo: Date, reason: string): string => {
      return `The user blocked from ${dateFrom.toISOString()} to ${dateTo.toISOString()}. Reason: ${reason}`;
    },
  },
  ACTIVATE_BY_ADMIN: {
    CONTEXT: 'Update activity',
    MESSAGE: (userId: string, adminId: string): string => {
      return `User with ID ${userId} activated by admin with ID ${adminId}`;
    },
  },
  UPDATE_EMAIL: {
    CONTEXT: 'Update email',
    MESSAGE: (userId: string, newEmail: string): string => {
      return `User with id ${userId} changed email to ${newEmail}`;
    },
  },
  DELETE_USER: {
    CONTEXT: 'Delete User',
    MESSAGE: (userId: string): string => {
      return `User with id ${userId} deleted successfully`;
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
  INVALID_NICKNAME_STRING: 'Nickname',
  BIRTH_DATE_FUTURE: 'Birth date from cannot be in future',
  BIRTH_DATE_FROM_FEWER: 'Birth date from cannot be fewer, than birthDateTo',
  UPDATE_PROFILE_DATA_NOT_FOUND: 'Invalid update data',
  REPUTATION_FROM_BIGGER: 'Reputation from cannot be more than reputation to',
  ACTION_VALIDATION: {
    ENUM: `Invalid action option. Available options: ${Object.values(Actions).join(', ')}`,
  },
  ACTIVITY_VALIDATION: {
    ENUM: `Invalid activity type. Available options: ${Object.values(ActivityType).join(', ')}`,
  },
  BIRTH_DATE_VALIDATION: {
    NOT_EMPTY: 'Birth date should not be empty',
    TYPE: 'Birth date should be in correct format. Example: 2026-06-15T00:00:00.000Z',
    MAX: 'Birth date cannot be in future',
  },
  DESCRIPTION_VALIDATION: {
    TYPE: 'Description should be a string',
    MIN_LENGTH: `Minimal length of description is ${PROFILE_CONFIG.DESCRIPTION.MIN_LENGTH}`,
    MAX_LENGTH: `Maximum length of description is ${PROFILE_CONFIG.DESCRIPTION.MAX_LENGTH}`,
  },
  NAME_VALIDATION: {
    TYPE: 'Name should be a string',
    MIN_LENGTH: `Minimal length of name is ${PROFILE_CONFIG.NAME.MIN_LENGTH}`,
    MAX_LENGTH: `Maximum length of name is ${PROFILE_CONFIG.NAME.MAX_LENGTH}`,
  },
  SURNAME_VALIDATION: {
    TYPE: 'Surname should be a string',
    MIN_LENGTH: `Minimal length of surname is ${PROFILE_CONFIG.SURNAME.MIN_LENGTH}`,
    MAX_LENGTH: `Maximum length of surname is ${PROFILE_CONFIG.SURNAME.MAX_LENGTH}`,
  },
  NICKNAME_VALIDATION: {
    TYPE: 'Nickname should be a string',
    MIN_LENGTH: `Minimal length of nickname is ${
      PROFILE_CONFIG.NICKNAME.MIN_LENGHT
    }`,
    MAX_LENGTH: `Maximum length of nickname is ${PROFILE_CONFIG.NICKNAME.MAX_LENGTH}`,
  },
  REPUTATION_VALIDATION: {
    NOT_EMPTY: 'Reputation should not be empty',
    TYPE: 'Reputation should be a number',
  },
} as const;
