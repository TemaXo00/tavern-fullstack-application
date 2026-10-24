import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PROFILE_CONFIG } from '@org/validation-config'
import { PROFILE_MESSAGES } from '@org/validation-messages'
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator'

export function ReputationScore(required = true): PropertyDecorator {
  const requiredDecorator = required
    ? IsNotEmpty({ message: PROFILE_MESSAGES.REPUTATION_VALIDATION.NOT_EMPTY })
    : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Reputation score',
      type: 'integer',
      example: 15,
      minimum: PROFILE_CONFIG.REPUTATION_SCORE.MIN,
      maximum: PROFILE_CONFIG.REPUTATION_SCORE.MAX,
      required,
    }),
    requiredDecorator,
    IsInt({ message: PROFILE_MESSAGES.REPUTATION_VALIDATION.TYPE }),
    Min(PROFILE_CONFIG.REPUTATION_SCORE.MIN, { message: PROFILE_MESSAGES.REPUTATION_VALIDATION.MIN }),
    Max(PROFILE_CONFIG.REPUTATION_SCORE.MAX, { message: PROFILE_MESSAGES.REPUTATION_VALIDATION.MAX }),
  )
}
