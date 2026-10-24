import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export function Name(required = true): PropertyDecorator {
  const requiredDecorator = required ? IsNotEmpty({ message: SHARED_MESSAGES.NAME_VALIDATION.NOT_EMPTY }) : IsOptional()
  return applyDecorators(
    ApiProperty({
      description: 'Name',
      example: 'Joe',
      required: required,
      type: 'string',
      minLength: SHARED_CONFIG.NAME.MIN_LENGTH,
      maxLength: SHARED_CONFIG.NAME.MAX_LENGTH,
    }),
    requiredDecorator,
    IsString({ message: SHARED_MESSAGES.NAME_VALIDATION.TYPE }),
    MinLength(SHARED_CONFIG.NAME.MIN_LENGTH, {
      message: SHARED_MESSAGES.NAME_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(SHARED_CONFIG.NAME.MAX_LENGTH, {
      message: SHARED_MESSAGES.NAME_VALIDATION.MAX_LENGTH,
    }),
  )
}
