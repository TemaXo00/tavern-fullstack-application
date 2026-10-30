import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { BLOG_CONFIG } from '@org/validation-config'
import { BLOG_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export function ArticleContent(required = true): PropertyDecorator {
  const requiredDecorator = required
    ? IsNotEmpty({ message: BLOG_MESSAGES.CONTENT_VALIDATION.NOT_EMPTY })
    : IsOptional()
  return applyDecorators(
    ApiProperty({
      description: 'Article content. In markdown style',
      example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      type: 'string',
      required: required,
      minLength: BLOG_CONFIG.CONTENT.MIN_LENGTH,
      maxLength: BLOG_CONFIG.CONTENT.MAX_LENGTH,
    }),
    requiredDecorator,
    IsString({ message: BLOG_MESSAGES.CONTENT_VALIDATION.TYPE }),
    MinLength(BLOG_CONFIG.CONTENT.MIN_LENGTH, {
      message: BLOG_MESSAGES.CONTENT_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(BLOG_CONFIG.CONTENT.MAX_LENGTH, {
      message: BLOG_MESSAGES.CONTENT_VALIDATION.MAX_LENGTH,
    }),
  )
}
