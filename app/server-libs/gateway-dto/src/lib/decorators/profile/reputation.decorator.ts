import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PROFILE_MESSAGES } from '@org/validation-messages'
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator'

export function Reputation(required = true): PropertyDecorator {
  const requiredDecorator = required
    ? IsNotEmpty({ message: PROFILE_MESSAGES.REPUTATION_VALIDATION.NOT_EMPTY })
    : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Reputation for user',
      type: 'integer',
      example: 15,
      required,
    }),
    requiredDecorator,
    IsInt({ message: PROFILE_MESSAGES.REPUTATION_VALIDATION.TYPE }),
  )
}
