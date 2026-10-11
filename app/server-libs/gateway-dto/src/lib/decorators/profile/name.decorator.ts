import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PROFILE_CONFIG } from '@org/validation-config';
import { PROFILE_MESSAGES } from '@org/validation-messages';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function Name(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User name',
      example: 'Joe',
      required: false,
      type: 'string',
      minLength: PROFILE_CONFIG.NAME.MIN_LENGTH,
      maxLength: PROFILE_CONFIG.NAME.MAX_LENGTH,
    }),
    IsOptional(),
    IsString({ message: PROFILE_MESSAGES.NAME_VALIDATION.TYPE }),
    MinLength(PROFILE_CONFIG.NAME.MIN_LENGTH, {
      message: PROFILE_MESSAGES.NAME_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(PROFILE_CONFIG.NAME.MAX_LENGTH, {
      message: PROFILE_MESSAGES.NAME_VALIDATION.MAX_LENGTH,
    }),
  );
}
