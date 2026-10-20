import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { EVENT_MESSAGES } from '@org/validation-messages'
import { isBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export function IsJoinBlocked(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required
    ? IsNotEmpty({ message: EVENT_MESSAGES.IS_JOIN_BLOCKED_VALIDATION.NOT_EMPTY })
    : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Is join state',
      required: options.required,
      type: 'boolean',
      example: false,
    }),
    requiredDecorator,
    isBoolean,
  )
}
