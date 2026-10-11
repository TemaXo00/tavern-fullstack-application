import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PROFILE_CONFIG } from '@org/validation-config';
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
    IsString(),
    MinLength(PROFILE_CONFIG.DESCRIPTION.MIN_LENGTH),
    MaxLength(PROFILE_CONFIG.DESCRIPTION.MAX_LENGTH),
  );
}
