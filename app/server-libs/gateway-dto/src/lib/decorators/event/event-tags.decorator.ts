import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { EVENT_CONFIG } from '@org/validation-config'
import { EVENT_MESSAGES } from '@org/validation-messages'
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export function EventTags(required = true): PropertyDecorator {
  const requiredDecorator = required ? IsNotEmpty({ message: EVENT_MESSAGES.TAGS_VALIDATION.NOT_EMPTY }) : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Event tags',
      example: ['tag1', 'tag2'],
      type: 'array',
      required: required,
    }),
    requiredDecorator,
    IsArray({ message: EVENT_MESSAGES.TAGS_VALIDATION.NOT_ARRAY }),
    ArrayMinSize(1, { message: EVENT_MESSAGES.TAGS_VALIDATION.ARRAY_MIN }),
    ArrayMaxSize(EVENT_CONFIG.TAG.ARRAY_MAX_SIZE, {
      message: EVENT_MESSAGES.TAGS_VALIDATION.ARRAY_MAX,
    }),
    IsString({
      message: EVENT_MESSAGES.TAGS_VALIDATION.NOT_STRING,
      each: true,
    }),
    ArrayUnique({ message: EVENT_MESSAGES.TAGS_VALIDATION.ARRAY_UNIQUE }),
  )
}
