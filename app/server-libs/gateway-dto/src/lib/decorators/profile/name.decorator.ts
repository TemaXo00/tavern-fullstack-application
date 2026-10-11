import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PROFILE_CONFIG } from '@org/validation-config';
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
    IsString(),
    MinLength(PROFILE_CONFIG.NAME.MIN_LENGTH),
    MaxLength(PROFILE_CONFIG.NAME.MAX_LENGTH),
  );
}
