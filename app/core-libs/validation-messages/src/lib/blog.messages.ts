import { BLOG_CONFIG } from '@org/validation-config'

export const BLOG_MESSAGES = {
  TAGS_VALIDATION: {
    NOT_EMPTY: 'Tags cannot be empty array',
    NOT_ARRAY: 'Tags should be in array format',
    NOT_STRING: 'Each tag in array must be a string value',
    ARRAY_MIN: 'Minimal size of array is 1 entry',
    ARRAY_MAX: `Maximum size of array is ${BLOG_CONFIG.TAG.ARRAY_MAX_SIZE}`,
    ARRAY_UNIQUE: 'Tags entries must be unique',
  },
  DATE_VALIDATION: {
    NOT_EMPTY: 'Date should not be empty',
    TYPE: 'Date should be in correct format. Example: 2026-06-15T00:00:00.000Z',
    MAX: 'Date cannot be in future',
  },
} as const
