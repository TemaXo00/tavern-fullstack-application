import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_CONFIG } from '@org/validation-config';
import { AUTH_MESSAGES } from '@org/validation-messages';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export function Password(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: `Password. Should have min ${AUTH_CONFIG.PASSWORD.MIN_LENGHT} length, include ${AUTH_CONFIG.PASSWORD.MIN_LOWERCASE} lowercase, ${AUTH_CONFIG.PASSWORD.MIN_UPPERCASE} uppercase, ${AUTH_CONFIG.PASSWORD.MIN_NUMBERS} number, ${AUTH_CONFIG.PASSWORD.MIN_SYMBOLS}`,
      example: 'PassW1d1',
      type: 'string',
    }),
    IsNotEmpty({ message: AUTH_MESSAGES.PASSWORD_VALIDATION.NOT_EMPTY }),
    IsString({ message: AUTH_MESSAGES.PASSWORD_VALIDATION.TYPE }),
    IsStrongPassword(
      {
        minLength: AUTH_CONFIG.PASSWORD.MIN_LENGHT,
        minLowercase: AUTH_CONFIG.PASSWORD.MIN_LOWERCASE,
        minUppercase: AUTH_CONFIG.PASSWORD.MIN_UPPERCASE,
        minNumbers: AUTH_CONFIG.PASSWORD.MIN_NUMBERS,
        minSymbols: AUTH_CONFIG.PASSWORD.MIN_SYMBOLS,
      },
      {
        message: AUTH_MESSAGES.PASSWORD_VALIDATION.STRONG,
      },
    ),
  );
}
