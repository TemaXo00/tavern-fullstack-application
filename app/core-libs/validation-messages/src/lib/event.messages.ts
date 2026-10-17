import { EventStatuses } from '@org/enums';
import { EVENT_CONFIG } from '@org/validation-config';

export const EVENT_MESSAGES = {
  TAG_NOT_FOUND: 'Tag not found',
  TAG_SLUG_EXISTING:
    'Tag with this name or slug already existing. Please, change name',
  INVALID_TAG_SLUG_STRING: 'Slug',
  INVALID_TAG_NAME_STRING: 'Name',
  COLOR_VALIDATION: {
    TYPE: 'Color must be in string format',
    FORMAT: 'Color must be in HEX format (example: #696969)',
    LENGTH: 'Color must contain 7 characters',
  },
  DATE_VALIDATION: {
    NOT_EMPTY: 'Date should not be empty',
    TYPE: 'Date should be in correct format. Example: 2026-06-15T00:00:00.000Z',
    MAX: 'Date cannot be in future',
  },
  PLACES_VALIDATION: {
    NOT_EMPTY: 'Places should not be empty',
    TYPE: 'Places should be a number',
    MIN: 'Places cannot be less than 0',
  },
  TAGS_VALIDATION: {
    NOT_EMPTY: 'Tags cannot be empty array',
    NOT_ARRAY: 'Tags should be in array format',
    NOT_STRING: 'Each tag in array must be a string value',
    ARRAY_MIN: 'Minimal size of array is 1 entry',
    ARRAY_MAX: `Maximum size of array is ${EVENT_CONFIG.TAG.ARRAY_MAX_SIZE}`,
    ARRAY_UNIQUE: 'Tags entries must be unique',
  },
  MESSAGE_VALIDATION: {
    NOT_EMPTY: 'Message should not be empty',
    TYPE: 'Message should be a string',
    MIN_LENGTH: `Minimal length of message is ${EVENT_CONFIG.MESSAGE.MIN_LENGTH}`,
    MAX_LENGTH: `Maximum length of message is ${EVENT_CONFIG.MESSAGE.MAX_LENGTH}`,
  },
  EVENT_STATUS_VALIDATION: {
    ENUM: (): string =>
      `Invalid status. Available options: ${Object.values(EventStatuses).join(', ')}`,
  },
  USER_SNAPSHOT_EXISTING_ERROR: {
    CONTEXT: 'CreateUserSnaphost',
    METHOD: 'FindUser',
    MESSAGE: (id: string): string => {
      return `User with id ${id} does not exists`;
    },
  },
  USER_SHAPSHOT_CREATE_SUCCESS: {
    CONTEXT: 'CreateUserSnapshot',
    METHOD: (id: string): string => {
      return `CreateUser ${id}`;
    },
  },
  USER_SHAPSHOT_UNBLOCK_SUCCESS: {
    CONTEXT: 'UnblockUserSnapshot',
    METHOD: (id: string): string => {
      return `UnblockUser ${id}`;
    },
  },
} as const;
