import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { BLOG_MESSAGES } from '@org/validation-messages'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsOptional, MaxDate } from 'class-validator'

export function BlogDate(requirable: boolean): PropertyDecorator {
  const requirableDecorator = requirable
    ? IsNotEmpty({ message: BLOG_MESSAGES.DATE_VALIDATION.NOT_EMPTY })
    : IsOptional()
  return applyDecorators(
    ApiProperty({
      description: 'Log date',
      example: '2026-06-15T00:00:00.000Z',
      type: 'string',
      format: 'date-time',
      required: requirable,
    }),
    requirableDecorator,
    Type(() => Date),
    IsDate({ message: BLOG_MESSAGES.DATE_VALIDATION.TYPE }),
    MaxDate(() => new Date(), {
      message: BLOG_MESSAGES.DATE_VALIDATION.MAX,
    }),
  )
}
