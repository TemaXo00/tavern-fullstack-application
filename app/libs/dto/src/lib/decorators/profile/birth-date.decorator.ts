import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, MaxDate } from 'class-validator';

export function BirthDate(requirable: boolean): PropertyDecorator {
  const requirableDecorator = requirable ? IsNotEmpty() : IsOptional();
  return applyDecorators(
    ApiProperty({
      description: 'User birth date',
      example: '2026-09-26T09:00:00.000Z',
      type: 'string',
      format: 'date-time',
      required: requirable,
    }),
    requirableDecorator,
    Type(() => Date),
    IsDate(),
    MaxDate(() => new Date()),
  );
}
