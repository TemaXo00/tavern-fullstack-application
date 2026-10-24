import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PROFILE_CONFIG } from '@org/validation-config'
import { PROFILE_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export function ReputationMessage(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Reputation message',
      example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      type: 'string',
      required: true,
      minLength: PROFILE_CONFIG.REPUTATION_MESSAGE.MIN_LENGTH,
      maxLength: PROFILE_CONFIG.REPUTATION_MESSAGE.MAX_LENGTH,
    }),
    IsNotEmpty({ message: PROFILE_MESSAGES.REPUTATION_MESSAGE_VALIDATION.NOT_EMPTY }),
    IsString({ message: PROFILE_MESSAGES.REPUTATION_MESSAGE_VALIDATION.TYPE }),
    MinLength(PROFILE_CONFIG.REPUTATION_MESSAGE.MIN_LENGTH, {
      message: PROFILE_MESSAGES.REPUTATION_MESSAGE_VALIDATION.MIN_LENGTH,
    }),
    MaxLength(PROFILE_CONFIG.REPUTATION_MESSAGE.MAX_LENGTH, {
      message: PROFILE_MESSAGES.REPUTATION_MESSAGE_VALIDATION.MAX_LENGTH,
    }),
  )
}
