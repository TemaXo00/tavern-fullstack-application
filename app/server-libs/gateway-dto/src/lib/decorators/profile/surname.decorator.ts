import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PROFILE_CONFIG } from '@org/validation-config';
import { PROFILE_MESSAGES } from '@org/validation-messages';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function Surname(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User surname',
      example: 'Doe',
      type: 'string',
      required: false,
      minLength: PROFILE_CONFIG.SURNAME.MIN_LENGTH,
      maxLength: PROFILE_CONFIG.SURNAME.MAX_LENGTH,
    }),
    IsOptional(),
    IsString({ message: PROFILE_MESSAGES.SURNAME_VALIDATION.TYPE }),
    MinLength(PROFILE_CONFIG.SURNAME.MIN_LENGTH, {
      message: PROFILE_MESSAGES.SURNAME_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(PROFILE_CONFIG.SURNAME.MAX_LENGTH, {
      message: PROFILE_MESSAGES.SURNAME_VALIDATION.MAX_LENGTH,
    }),
  );
}
