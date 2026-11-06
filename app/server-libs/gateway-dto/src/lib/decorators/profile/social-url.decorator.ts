import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PROFILE_CONFIG } from '@org/validation-config'
import { PROFILE_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator'

export function SocialUrl(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Social URL',
      example: 'https://github.com/TemaXo00',
      type: 'string',
      required: true,
      maxLength: PROFILE_CONFIG.SOCIAL_URL.MAX_LENGTH,
    }),
    IsNotEmpty({ message: PROFILE_MESSAGES.SOCIAL_URL_VALIDATION.NOT_EMPTY }),
    MaxLength(PROFILE_CONFIG.SOCIAL_URL.MAX_LENGTH, { message: PROFILE_MESSAGES.SOCIAL_URL_VALIDATION.MAX_LENGTH }),
    IsUrl(
      {
        require_host: true,
        require_port: false,
        protocols: ['https'],
      },
      { message: PROFILE_MESSAGES.SOCIAL_URL_VALIDATION.NOT_URL },
    ),
  )
}
