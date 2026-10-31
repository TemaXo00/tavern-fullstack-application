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
    MESSAGE: (id: string): string => `User with id ${id} does not exists`,
  },
  USER_SNAPSHOT_NICKNAME_EXISTING_ERROR: {
    CONTEXT: 'ManipulateUserSnapshot',
    METHOD: 'FindUserByNickname',
    MESSAGE: (nickname: string): string => `User with ${nickname} existsing`,
  },
  USER_SHAPSHOT_CREATE_SUCCESS: {
    CONTEXT: 'CreateUserSnapshot',
    METHOD: (id: string): string => `CreateUser ${id}`,
  },
  USER_CHANGE_NICKNAME_SUCCESS: {
    CONTEXT: 'ChangeNickname',
    METHOD: (userId: string) => `Change nickname of ${userId}}`,
  },
  USER_CHANGE_NICKNAME_WARNING: {
    CONTEXT: 'ChangeNickname',
    METHOD: (userId: string) => `Change nickname of ${userId}}`,
    MESSAGE: 'Nickname does not found in payload',
  },
  USER_DELETE_SUCCESS: {
    CONTEXT: 'DeleteUser',
    METHOD: (userId: string) => `Delete of ${userId}}`,
  },
  INVALID_TAG_SLUG_STRING: 'Slug',
  INVALID_TAG_NAME_STRING: 'Name',
  INVALID_ARTICLE_SLUG_STRING: 'Article slug',
  INVALID_ARTICLE_NAME_STRING: 'Article name',
  INVALID_ARTICLE_SHORT_DESC_STRING: 'Article short description',
  INVALID_ARTICLE_CONTENT_STRING: 'Article content',
  INVALID_NICKNAME_STRING: 'Nickname',
  TAG_NOT_FOUND: 'Tag not found',
  TAG_SLUG_EXISTING: 'Tag with this name or slug already existing. Please, change name',
  ARTICLE_NOT_FOUND: 'Article not found',
  AUTHOR_NOT_FOUND: 'This article does not have author',
  ONE_OR_MANY_TAGS_NOT_FOUND: 'One or many tags for this article not found. Please, check tags',
  ARTICLE_SLUG_EXISTING: 'Article with this name or slug already existing. Please, change name',
  ARTICLE_STATUS_CONFLICT: 'You cant set same status on this article',
} as const
