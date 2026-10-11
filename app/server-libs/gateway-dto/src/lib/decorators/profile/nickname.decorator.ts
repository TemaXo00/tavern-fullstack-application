import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PROFILE_CONFIG } from '@org/validation-config';
import { PROFILE_MESSAGES } from '@org/validation-messages';
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
    IsString({ message: PROFILE_MESSAGES.NICKNAME_VALIDATION.TYPE }),
    MinLength(PROFILE_CONFIG.NICKNAME.MIN_LENGHT, {
      message: PROFILE_MESSAGES.NICKNAME_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(PROFILE_CONFIG.NICKNAME.MAX_LENGTH, {
      message: PROFILE_MESSAGES.NICKNAME_VALIDATION.MAX_LENGTH,
    }),
  );
}
