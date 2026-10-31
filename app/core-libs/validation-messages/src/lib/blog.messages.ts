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
  IS_ANONIM_VALIDATION: {
    NOT_EMPTY: 'Is anonim cannot be empty',
  },
  CONTENT_VALIDATION: {
    NOT_EMPTY: 'Article content cannot be empty string',
    TYPE: 'Article content should be a string',
    MIN_LENGTH: `Minimal length of content is ${BLOG_CONFIG.CONTENT.MIN_LENGTH}`,
    MAX_LENGTH: `Maximum length of content is ${BLOG_CONFIG.CONTENT.MAX_LENGTH}`,
  },
  USER_SNAPSHOT_EXISTING_ERROR: {
    CONTEXT: 'ManipulateUserSnapshot',
    METHOD: 'FindUserByID',
    MESSAGE: (id: string): string => {
      return `User with id ${id} does not exists`
    },
  },
  USER_SNAPSHOT_NICKNAME_EXISTING_ERROR: {
    CONTEXT: 'ManipulateUserSnapshot',
    METHOD: 'FindUserByNickname',
    MESSAGE: (nickname: string): string => {
      return `User with ${nickname} existsing`
    },
  },
  USER_SHAPSHOT_CREATE_SUCCESS: {
    CONTEXT: 'CreateUserSnapshot',
    METHOD: (id: string): string => {
      return `CreateUser ${id}`
    },
  },
  USER_CHANGE_NICKNAME_SUCCESS: {
    CONTEXT: 'ChangeNickname',
    METHOD: (userId: string) => {
      return `Change nickname of ${userId}}`
    },
  },
  USER_CHANGE_NICKNAME_WARNING: {
    CONTEXT: 'ChangeNickname',
    METHOD: (userId: string) => {
      return `Change nickname of ${userId}}`
    },
    MESSAGE: 'Nickname does not found in payload',
  },
  USER_DELETE_SUCCESS: {
    CONTEXT: 'DeleteUser',
    METHOD: (userId: string) => {
      return `Delete of ${userId}}`
    },
  },
} as const
