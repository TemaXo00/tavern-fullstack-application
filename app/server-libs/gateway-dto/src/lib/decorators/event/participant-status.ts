import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ParticipantStatuses } from '@org/enums'
import { EVENT_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function ParticipantStatusesDecorator(required = true): PropertyDecorator {
  const requiredDecorator = required
    ? IsNotEmpty({ message: EVENT_MESSAGES.PARTICIPANT_STATUS_VALIDATION.NOT_EMPTY })
    : IsOptional()
  return applyDecorators(
    ApiProperty({
      description: 'Participant Statuses',
      required,
      enum: ParticipantStatuses,
    }),
    requiredDecorator,
    IsEnum(ParticipantStatuses, {
      message: EVENT_MESSAGES.PARTICIPANT_STATUS_VALIDATION.ENUM,
    }),
  )
}
