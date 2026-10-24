import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { EVENT_MESSAGES } from '@org/validation-messages'
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator'

export function EventPlaces(required = true): PropertyDecorator {
  const requiredDecorator = required
    ? IsNotEmpty({ message: EVENT_MESSAGES.PLACES_VALIDATION.NOT_EMPTY })
    : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Event places',
      type: 'integer',
      example: 15,
      required,
    }),
    requiredDecorator,
    IsInt({ message: EVENT_MESSAGES.PLACES_VALIDATION.TYPE }),
    Min(0, { message: EVENT_MESSAGES.PLACES_VALIDATION.MIN }),
  )
}
