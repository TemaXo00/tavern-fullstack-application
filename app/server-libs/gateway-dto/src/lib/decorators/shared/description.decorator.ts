import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export function Description(required = true): PropertyDecorator {
  const requiredDecorator = required
    ? IsNotEmpty({ message: SHARED_MESSAGES.DESCRIPTION_VALIDATION.NOT_EMPTY })
    : IsOptional()
  return applyDecorators(
    ApiProperty({
      description: 'Description',
      example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      type: 'string',
      required: required,
      minLength: SHARED_CONFIG.DESCRIPTION.MIN_LENGTH,
      maxLength: SHARED_CONFIG.DESCRIPTION.MAX_LENGTH,
    }),
    requiredDecorator,
    IsString({ message: SHARED_MESSAGES.DESCRIPTION_VALIDATION.TYPE }),
    MinLength(SHARED_CONFIG.DESCRIPTION.MIN_LENGTH, {
      message: SHARED_MESSAGES.DESCRIPTION_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(SHARED_CONFIG.DESCRIPTION.MAX_LENGTH, {
      message: SHARED_MESSAGES.DESCRIPTION_VALIDATION.MAX_LENGTH,
    }),
  )
}
