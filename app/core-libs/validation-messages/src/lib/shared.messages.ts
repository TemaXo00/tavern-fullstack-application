import { SHARED_CONFIG } from '@org/validation-config';

export const SHARED_MESSAGES = {
  INVALID_DATE: 'Invalid date',
  INVALID_EMAIL: 'Email',
  INVALID_ID: 'ID',
  INVALID_DATA: 'Data',
  INVALID_SLUG: 'Slug',
  RPC_ERROR: (arg: string): string => {
    return `Invalid ${arg}`;
  },
  PAGINATION_LIMIT_VALIDATION: {
    TYPE: 'Limit should be a number',
    MIN: 'Minimal limit is 1 object',
  },
  PAGINATION_PAGE_VALIDATION: {
    TYPE: 'Page should be a number',
    MIN: 'Minimal page is 1',
  },
  PAGINATION_SEARCH_VALIDATION: {
    TYPE: 'Search should be a string',
    LENGTH: `Search string should be from ${SHARED_CONFIG.SEARCH.MIN_LENGTH} to ${SHARED_CONFIG.SEARCH.MAX_LENGTH}`,
  },
  ID_VALIDATION: {
    NOT_EMPTY: 'ID should not be empty',
    TYPE: 'ID should be a string',
    UUID: 'ID should have correct format',
  },
} as const;
