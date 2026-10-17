import { Roles, TokenStates } from '@org/enums';
import { AUTH_CONFIG } from '@org/validation-config';

export const AUTH_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  PASSWORDS_NOT_SIMILAR: 'Passwords are not similar',
  INVALID_TOKEN: 'Invalid token',
  USER_WITH_EMAIL_EXISTS: 'User with this email already exists',
  CANNOT_PROMOTE_ADMIN: 'You cannot promote admin',
  CANNOT_PROMOTE_USER: 'You cannot promote user, cause he registered less than 1 year ago',
  USER_NOT_MODERATOR: 'User not moderator',
  USER_BLOCKED: (blockedUntil: Date, reason: string): string => {
    return `User blocked until ${blockedUntil.toDateString()}. Reason: ${reason}`;
  },
  USER_INACTIVE: 'User inactive',
  ACCESS_DENIED: 'Access denied',
  UNAUTHORIZED: 'Unauthorized',
  VALIDATION_DATA_REQUIRED: 'Validation data required',
  SESSION_REQUIRED: 'Session data is required',
  CANNOT_CNANGE_ADMIN: 'You cannot change admin role',
  CANNOT_CHANGE_SIMILAR: 'You cannot change user with similar role',
  USER_NOT_BLOCKED: 'User is not blocked',
  INVALID_BLOCK_DATE: 'Invalid block date',
  BLOCK_PREVIOUS_DATE: 'You cannot block user by previous date',
  BLOCK_TOO_FAR: `The block date is too far in the future. The maximum duration for blocking a user is ${AUTH_CONFIG.BLOCK.MAX_DATE_YEAR} years.`,
  SESSION_NOT_FOUND: 'Session not found',
  CURRENT_SESSION_DELETE: "You can't delete your own session. If you need, you can logout",
  INVALID_SESSION: 'Invalid session',
  SESSION_DELETE_FAILED: "You can't delete session",
  TOKEN_NOT_FOUND: 'Token not found',
  TOKEN_USED: 'Token used',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Token invalid',
  TOKEN_BASE_ERROR: 'Invalid or expired token',
  INVALID_PASSWORD_STRING: 'Password',
  INVALID_LOCAL_NAME_STRING: 'Local name',
  INVALID_BLOCK_REASON_STRING: 'Block reason',
  INVALID_DEVICE_STRING: 'Device',
  INVALID_BROWSER_STRING: 'Browser',
  INVALID_IP_STRING: 'IP',
  INVALID_OS_STRING: 'OS',
  INVALID_REFRESH_STRING: 'Refresh token',
  INVALID_TOKEN_STRING: 'Token',
  BLOCK_REASON_VALIDATION: {
    NOT_EMPTY: 'Block reason cannot be empty string',
    TYPE: 'Block reason should be a string',
    LENGTH: `Block reason should be from ${AUTH_CONFIG.BLOCK_REASON.MIN_LENGTH} to ${AUTH_CONFIG.BLOCK_REASON.MAX_LENGTH} symbols`,
  },
  BLOCKED_UNTIL_VALIDATION: {
    NOT_EMPTY: 'Blocked until cannot be empty',
    TYPE: 'Blocked until should be in date and time format. Example: 2026-09-26T09:00:00.000Z',
    DATE: 'Minimal block date must be later than the current date',
  },
  IS_ACTIVE_VALIDATION: {
    NOT_EMPTY: 'Is active cannot be empty',
  },
  IS_BLOCKED_VALIDATION: {
    NOT_EMPTY: 'Is blocked cannot be empty',
  },
  LOCAL_NAME_VALIDATION: {
    NOT_EMPTY: 'Local name cannot be empty string',
    TYPE: 'Local name should be string type',
    LENGTH: `Local name should be from ${AUTH_CONFIG.LOCAL_NAME.MIN_LENGTH} to ${AUTH_CONFIG.LOCAL_NAME.MAX_LENGTH} symbols`,
  },
  PASSWORD_VALIDATION: {
    NOT_EMPTY: 'Password should be not empty string',
    TYPE: 'Password should be a string',
    STRONG: `Password not strong. It should have next params: Minimal length: ${AUTH_CONFIG.PASSWORD.MIN_LENGHT}; Minimal lowercase symbols: ${AUTH_CONFIG.PASSWORD.MIN_LOWERCASE}; Minimal uppercase symbols: ${AUTH_CONFIG.PASSWORD.MIN_UPPERCASE}; Minimal numbers: ${AUTH_CONFIG.PASSWORD.MIN_NUMBERS}; Minimal symbols: ${AUTH_CONFIG.PASSWORD.MIN_SYMBOLS}`,
  },
  ROLE_VALIDATION: {
    NOT_EMPTY: 'Role cannot be empty',
    ENUM: (): string => `Invalid role. Available options: ${Object.values(Roles).join(', ')}`,
  },
  TOKEN_STATE_VALIDATION: {
    NOT_EMPTY: 'Token state cannot be empty',
    ENUM: (): string => `Invalid token state. Available options: ${Object.values(TokenStates).join(', ')}`,
  },
  EMAIL_VALIDATION: {
    NOT_EMPTY: 'Email should not be empty string',
    TYPE: 'Email should be a string type',
    MIN_LENGTH: `Min length of email: ${AUTH_CONFIG.EMAIL.MIN_LENGTH} characters`,
    EMAIL: 'The email address must be in the correct format',
  },
} as const;
