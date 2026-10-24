import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PROFILE_CONFIG } from '@org/validation-config'
import { PROFILE_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export function Nickname(required = true): PropertyDecorator {
  const requiredDecorator = required
    ? IsNotEmpty({ message: PROFILE_MESSAGES.NICKNAME_VALIDATION.NOT_EMPTY })
    : IsOptional()
  return applyDecorators(
    ApiProperty({
      description: 'User Nickname',
      example: 'joe_doe',
      type: 'string',
      required: required,
      minLength: PROFILE_CONFIG.NICKNAME.MIN_LENGHT,
      maxLength: PROFILE_CONFIG.NICKNAME.MAX_LENGTH,
    }),
    requiredDecorator,
    IsString({ message: PROFILE_MESSAGES.NICKNAME_VALIDATION.TYPE }),
    MinLength(PROFILE_CONFIG.NICKNAME.MIN_LENGHT, {
      message: PROFILE_MESSAGES.NICKNAME_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(PROFILE_CONFIG.NICKNAME.MAX_LENGTH, {
      message: PROFILE_MESSAGES.NICKNAME_VALIDATION.MAX_LENGTH,
    }),
  )
}
