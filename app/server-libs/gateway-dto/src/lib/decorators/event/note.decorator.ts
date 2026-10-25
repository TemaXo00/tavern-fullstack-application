import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { EVENT_CONFIG } from '@org/validation-config'
import { EVENT_MESSAGES } from '@org/validation-messages'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export function EventNote(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Note',
      example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      type: 'string',
      required: false,
      minLength: EVENT_CONFIG.NOTE.MIN_LENGTH,
      maxLength: EVENT_CONFIG.NOTE.MAX_LENGTH,
    }),
    IsOptional(),
    IsString({ message: EVENT_MESSAGES.MESSAGE_VALIDATION.TYPE }),
    MinLength(EVENT_CONFIG.NOTE.MIN_LENGTH, {
      message: EVENT_MESSAGES.NOTE_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(EVENT_CONFIG.NOTE.MAX_LENGTH, {
      message: EVENT_MESSAGES.NOTE_VALIDATION.MAX_LENGTH,
    }),
  )
}
