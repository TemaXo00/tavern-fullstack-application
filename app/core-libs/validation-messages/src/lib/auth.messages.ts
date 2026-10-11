import { AUTH_CONFIG } from '@org/validation-config';

export const AUTH_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  PASSWORDS_NOT_SIMILAR: 'Passwords are not similar',
  INVALID_TOKEN: 'Invalid token',
  USER_WITH_EMAIL_EXISTS: 'User with this email already exists',
  CANNOT_PROMOTE_ADMIN: 'You cannot promote admin',
  CANNOT_PROMOTE_USER:
    'You cannot promote user, cause he registered less than 1 year ago',
  USER_NOT_MODERATOR: 'User not moderator',
  CANNOT_CNANGE_ADMIN: 'You cannot change admin role',
  CANNOT_CHANGE_SIMILAR: 'You cannot change user with similar role',
  USER_NOT_BLOCKED: 'User is not blocked',
  INVALID_BLOCK_DATE: 'Invalid block date',
  BLOCK_PREVIOUS_DATE: 'You cannot block user by previous date',
  BLOCK_TOO_FAR: `The block date is too far in the future. The maximum duration for blocking a user is ${AUTH_CONFIG.BLOCK.MAX_DATE_YEAR} years.`,
  SESSION_NOT_FOUND: 'Session not found',
  CURRENT_SESSION_DELETE:
    "You can't delete your own session. If you need, you can logout",
  SESSION_DELETE_FAILED: "You can't delete session",
  TOKEN_NOT_FOUND: 'Token not found',
  TOKEN_USED: 'Token used',
  TOKEN_EXPIRED: 'Token expired',
};
