import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { BLOG_CONFIG } from '@org/validation-config'
import { BLOG_MESSAGES } from '@org/validation-messages'
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export function BlogTags(required = true): PropertyDecorator {
  const requiredDecorator = required ? IsNotEmpty({ message: BLOG_MESSAGES.TAGS_VALIDATION.NOT_EMPTY }) : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Event tags',
      example: ['tag1', 'tag2'],
      type: 'array',
      required,
      items: { type: 'string' },
    }),
    requiredDecorator,
    IsArray({ message: BLOG_MESSAGES.TAGS_VALIDATION.NOT_ARRAY }),
    ArrayMinSize(1, { message: BLOG_MESSAGES.TAGS_VALIDATION.ARRAY_MIN }),
    ArrayMaxSize(BLOG_CONFIG.TAG.ARRAY_MAX_SIZE, {
      message: BLOG_MESSAGES.TAGS_VALIDATION.ARRAY_MAX,
    }),
    IsString({
      message: BLOG_MESSAGES.TAGS_VALIDATION.NOT_STRING,
      each: true,
    }),
    ArrayUnique({ message: BLOG_MESSAGES.TAGS_VALIDATION.ARRAY_UNIQUE }),
  )
}
