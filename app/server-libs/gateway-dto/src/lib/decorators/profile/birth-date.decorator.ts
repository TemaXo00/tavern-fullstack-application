import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PROFILE_MESSAGES } from '@org/validation-messages'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsOptional, MaxDate } from 'class-validator'

export function BirthDate(requirable: boolean): PropertyDecorator {
  const requirableDecorator = requirable
    ? IsNotEmpty({ message: PROFILE_MESSAGES.BIRTH_DATE_VALIDATION.NOT_EMPTY })
    : IsOptional()
  return applyDecorators(
    ApiProperty({
      description: 'User birth date',
      example: '2026-06-15T00:00:00.000Z',
      type: 'string',
      format: 'date-time',
      required: requirable,
    }),
    requirableDecorator,
    Type(() => Date),
    IsDate({ message: PROFILE_MESSAGES.BIRTH_DATE_VALIDATION.TYPE }),
    MaxDate(() => new Date(), {
      message: PROFILE_MESSAGES.BIRTH_DATE_VALIDATION.MAX,
    }),
  )
}
