import { EventStatuses, ParticipantStatuses } from '@org/enums'
import { EVENT_CONFIG } from '@org/validation-config'

export const EVENT_MESSAGES = {
  TAG_NOT_FOUND: 'Tag not found',
  TAG_SLUG_EXISTING: 'Tag with this name or slug already existing. Please, change name',
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
    MIN: 'Date cannot be less than now',
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
    ENUM: (): string => `Invalid status. Available options: ${Object.values(EventStatuses).join(', ')}`,
  },
  PARTICIPANT_STATUS_VALIDATION: {
    NOT_EMPTY: 'Participant status should not be empty',
    ENUM: (): string => `Invalid status. Available options: ${Object.values(ParticipantStatuses).join(', ')}`,
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
  USER_SHAPSHOT_UNBLOCK_SUCCESS: {
    CONTEXT: 'UnblockUserSnapshot',
    METHOD: (id: string): string => {
      return `UnblockUser ${id}`
    },
  },
  USER_SNAPHSOT_BLOCK_SUCCESS: {
    CONTEXT: 'BlockUserSnapshot',
    METHOD: (userId: string, adminId: string) => {
      return `BlockUser ${userId} by ${adminId}`
    },
  },
  USER_SNAPHSOT_CHANGE_STATE_SUCCESS: {
    CONTEXT: 'ChangeUserSnapshotState',
    METHOD: (userId: string, state: boolean) => {
      return `ChangeState of ${userId}. Current state: ${state ? 'active' : 'inactive'}`
    },
  },
  USER_SNAPHSOT_CHANGE_EMAIL_SUCCESS: {
    CONTEXT: 'ChangeUserSnapshotEmail',
    METHOD: (userId: string) => {
      return `ChangeEmail of ${userId}}`
    },
  },
  USER_SOFT_DELETE_SUCCESS: {
    CONTEXT: 'SoftDeleteUser',
    METHOD: (userId: string) => {
      return `SoftDelete of ${userId}}`
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
  USER_NOT_FOUND: 'User not found',
  EVENT_NOT_FOUND: 'Event not found',
  DRAFT_NOT_ORGANIZER: 'Only organizer can see detailed info about this event',
  EVENT_FINISHED: 'This event currently finished',
  EVENT_CANCELLED: 'This event cancelled',
  ONE_OR_MANY_TAGS_NOT_FOUND: 'One or many tags for this event not found. Please, check tags',
  ORGANIZER_PERMISSIONS: 'You does not have permission to manipulate with this event',
  EVENT_NOT_DRAFT: 'This event currently not DRAFT. You cant do this action',
  EVENT_NOT_PUBLISH: 'You cannot change status of this event cause it does not published',
  EVENT_DRAFT: 'This event is draft. You cant see details of it',
  EVENT_SLUG_FOUND: 'Event with same slug already exists. Please, rename your event',
  INVALID_NICKNAME_STRING: 'Nickname',
  IS_JOIN_BLOCKED_VALIDATION: {
    NOT_EMPTY: 'Is join blocked should not be empty',
  },
} as const
