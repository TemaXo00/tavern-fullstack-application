import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PROFILE_CONFIG } from '@org/validation-config';
import { PROFILE_MESSAGES } from '@org/validation-messages';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function Description(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User Description',
      example:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      type: 'string',
      required: false,
      minLength: PROFILE_CONFIG.DESCRIPTION.MIN_LENGTH,
      maxLength: PROFILE_CONFIG.DESCRIPTION.MAX_LENGTH,
    }),
    IsOptional(),
    IsString({ message: PROFILE_MESSAGES.DESCRIPTION_VALIDATION.TYPE }),
    MinLength(PROFILE_CONFIG.DESCRIPTION.MIN_LENGTH, {
      message: PROFILE_MESSAGES.DESCRIPTION_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(PROFILE_CONFIG.DESCRIPTION.MAX_LENGTH, {
      message: PROFILE_MESSAGES.DESCRIPTION_VALIDATION.MAX_LENGTH,
    }),
  );
}
