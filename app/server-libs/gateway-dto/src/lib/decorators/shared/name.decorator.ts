import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export function Name(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Name',
      example: 'Joe',
      required: false,
      type: 'string',
      minLength: SHARED_CONFIG.NAME.MIN_LENGTH,
      maxLength: SHARED_CONFIG.NAME.MAX_LENGTH,
    }),
    IsOptional(),
    IsString({ message: SHARED_MESSAGES.NAME_VALIDATION.TYPE }),
    MinLength(SHARED_CONFIG.NAME.MIN_LENGTH, {
      message: SHARED_MESSAGES.NAME_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(SHARED_CONFIG.NAME.MAX_LENGTH, {
      message: SHARED_MESSAGES.NAME_VALIDATION.MAX_LENGTH,
    }),
  )
}
