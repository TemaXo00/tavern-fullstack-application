import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PROFILE_CONFIG } from '@org/validation-config';
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
    IsString(),
    MinLength(PROFILE_CONFIG.SURNAME.MIN_LENGTH),
    MaxLength(PROFILE_CONFIG.SURNAME.MAX_LENGTH),
  );
}
