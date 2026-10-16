import { AUTH_CONFIG } from '@org/validation-config';
import { AUTH_MESSAGES } from '@org/validation-messages';
import * as z from 'zod';

const emailBase = z
  .string({ message: AUTH_MESSAGES.EMAIL_VALIDATION.TYPE })
  .min(AUTH_CONFIG.EMAIL.MIN_LENGTH, {
    message: AUTH_MESSAGES.EMAIL_VALIDATION.MIN_LENGTH,
  })
  .email({ message: AUTH_MESSAGES.EMAIL_VALIDATION.EMAIL });

export const emailConfig = emailBase;

export const optionalEmailConfig = z
  .string({ message: AUTH_MESSAGES.EMAIL_VALIDATION.TYPE })
  .trim()
  .pipe(emailBase)
  .or(z.literal(''))
  .optional();
