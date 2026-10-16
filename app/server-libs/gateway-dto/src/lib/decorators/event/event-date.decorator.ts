import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { EVENT_MESSAGES } from '@org/validation-messages';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, MaxDate } from 'class-validator';

export function EventDate(requirable: boolean): PropertyDecorator {
  const requirableDecorator = requirable
    ? IsNotEmpty({ message: EVENT_MESSAGES.DATE_VALIDATION.NOT_EMPTY })
    : IsOptional();
  return applyDecorators(
    ApiProperty({
      description: 'Event Date',
      example: '2026-06-15T00:00:00.000Z',
      type: 'string',
      format: 'date-time',
      required: requirable,
    }),
    requirableDecorator,
    Type(() => Date),
    IsDate({ message: EVENT_MESSAGES.DATE_VALIDATION.TYPE }),
    MaxDate(() => new Date(), {
      message: EVENT_MESSAGES.DATE_VALIDATION.MAX,
    }),
  );
}
