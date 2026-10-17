import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { TokenStates } from '@org/enums'
import { AUTH_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function TokenState(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required
    ? IsNotEmpty({ message: AUTH_MESSAGES.TOKEN_STATE_VALIDATION.NOT_EMPTY })
    : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Token state for token',
      required: options.required,
      enum: TokenStates,
    }),
    requiredDecorator,
    IsEnum(TokenStates, { message: AUTH_MESSAGES.TOKEN_STATE_VALIDATION.ENUM }),
  )
}
