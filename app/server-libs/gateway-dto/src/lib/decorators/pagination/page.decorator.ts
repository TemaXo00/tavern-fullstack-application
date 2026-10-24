import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsNumber, IsOptional, Min } from 'class-validator'

export function Page(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      name: 'page',
      description: 'Page of pagination',
      example: 1,
      minimum: 1,
      required: false,
      type: 'integer',
    }),
    IsOptional(),
    IsNumber({}, { message: SHARED_MESSAGES.PAGINATION_PAGE_VALIDATION.TYPE }),
    Min(1, { message: SHARED_MESSAGES.PAGINATION_PAGE_VALIDATION.MIN }),
  )
}
