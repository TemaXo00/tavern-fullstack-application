import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PROFILE_CONFIG } from '@org/validation-config';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function Nickname(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User Nickname',
      example: 'joe_doe',
      type: 'string',
      required: false,
      minLength: PROFILE_CONFIG.NICKNAME.MIN_LENGHT,
      maxLength: PROFILE_CONFIG.NICKNAME.MAX_LENGTH,
    }),
    IsOptional(),
    IsString(),
    MinLength(PROFILE_CONFIG.NICKNAME.MIN_LENGHT),
    MaxLength(PROFILE_CONFIG.NICKNAME.MAX_LENGTH),
  );
}
