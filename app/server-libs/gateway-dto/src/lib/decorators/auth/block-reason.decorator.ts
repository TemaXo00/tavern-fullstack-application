import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_CONFIG } from '@org/validation-config';
import { AUTH_MESSAGES } from '@org/validation-messages';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export function BlockReason(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Block reason for blocking user',
      example: 'Does not follow rules',
      type: 'string',
      minLength: AUTH_CONFIG.BLOCK_REASON.MIN_LENGTH,
      maxLength: AUTH_CONFIG.BLOCK_REASON.MAX_LENGTH,
    }),
    IsNotEmpty({ message: AUTH_MESSAGES.BLOCK_REASON_VALIDATION.NOT_EMPTY }),
    IsString({ message: AUTH_MESSAGES.BLOCK_REASON_VALIDATION.TYPE }),
    Length(AUTH_CONFIG.BLOCK_REASON.MIN_LENGTH, AUTH_CONFIG.BLOCK_REASON.MAX_LENGTH, {
      message: AUTH_MESSAGES.BLOCK_REASON_VALIDATION.LENGTH,
    }),
  );
}
