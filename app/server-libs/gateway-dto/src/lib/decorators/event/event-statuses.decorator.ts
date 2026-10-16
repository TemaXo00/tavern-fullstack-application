import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatuses } from '@org/enums';
import { EVENT_MESSAGES } from '@org/validation-messages';
import { IsEnum, IsOptional } from 'class-validator';

export function EventStatusesDecorator(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Event Statuses',
      required: false,
      enum: EventStatuses,
    }),
    IsOptional(),
    IsEnum(EventStatuses, {
      message: EVENT_MESSAGES.EVENT_STATUS_VALIDATION.ENUM,
    }),
  );
}
