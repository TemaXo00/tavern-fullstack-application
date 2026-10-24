import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsInt, IsOptional, Min } from 'class-validator'

export function Limit(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      name: 'limit',
      description: 'Limit of pagination',
      example: 10,
      required: false,
      minimum: 1,
      type: 'integer',
    }),
    IsOptional(),
    IsInt({ message: SHARED_MESSAGES.PAGINATION_LIMIT_VALIDATION.TYPE }),
    Min(1, { message: SHARED_MESSAGES.PAGINATION_LIMIT_VALIDATION.MIN }),
  )
}
