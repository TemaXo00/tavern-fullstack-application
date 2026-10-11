import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_CONFIG } from '@org/validation-config';
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
    IsNotEmpty(),
    IsString(),
    Length(
      AUTH_CONFIG.BLOCK_REASON.MIN_LENGTH,
      AUTH_CONFIG.BLOCK_REASON.MAX_LENGTH,
    ),
  );
}
