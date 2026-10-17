import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { EVENT_CONFIG } from '@org/validation-config'
import { EVENT_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export function EventMessage(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Message',
      example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      type: 'string',
      required: false,
      minLength: EVENT_CONFIG.MESSAGE.MIN_LENGTH,
      maxLength: EVENT_CONFIG.MESSAGE.MAX_LENGTH,
    }),
    IsNotEmpty({ message: EVENT_MESSAGES.MESSAGE_VALIDATION.NOT_EMPTY }),
    IsString({ message: EVENT_MESSAGES.MESSAGE_VALIDATION.TYPE }),
    MinLength(EVENT_CONFIG.MESSAGE.MIN_LENGTH, {
      message: EVENT_MESSAGES.MESSAGE_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(EVENT_CONFIG.MESSAGE.MAX_LENGTH, {
      message: EVENT_MESSAGES.MESSAGE_VALIDATION.MAX_LENGTH,
    }),
  )
}
