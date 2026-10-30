import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { BLOG_MESSAGES } from '@org/validation-messages'
import { isBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export function IsAnonim(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required
    ? IsNotEmpty({ message: BLOG_MESSAGES.IS_ANONIM_VALIDATION.NOT_EMPTY })
    : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Is anonim article state',
      required: options.required,
      type: 'boolean',
      example: false,
    }),
    requiredDecorator,
    isBoolean,
  )
}
