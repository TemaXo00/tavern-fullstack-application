import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { EVENT_MESSAGES } from '@org/validation-messages'
import { IsHexColor, IsOptional, IsString, Length } from 'class-validator'

export function Color(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Color',
      example: '#696969',
      type: 'string',
      required: false,
      minLength: 7,
      maxLength: 7,
    }),
    IsOptional(),
    IsString({ message: EVENT_MESSAGES.COLOR_VALIDATION.TYPE }),
    Length(7, 7, { message: EVENT_MESSAGES.COLOR_VALIDATION.LENGTH }),
    IsHexColor({ message: EVENT_MESSAGES.COLOR_VALIDATION.FORMAT }),
  )
}
