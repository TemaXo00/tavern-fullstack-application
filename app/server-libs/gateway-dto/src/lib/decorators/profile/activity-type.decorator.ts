import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ActivityType } from '@org/enums'
import { PROFILE_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsOptional } from 'class-validator'

export function Activity(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Activity for current profile activity logs',
      required: false,
      enum: ActivityType,
    }),
    IsOptional(),
    IsEnum(ActivityType, {
      message: PROFILE_MESSAGES.ACTIVITY_VALIDATION.ENUM,
    }),
  )
}
