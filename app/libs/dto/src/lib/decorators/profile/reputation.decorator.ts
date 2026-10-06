import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export function Reputation(required = true): PropertyDecorator {
  const requiredDecorator = required ? IsNotEmpty() : IsOptional();

  return applyDecorators(
    ApiProperty({
      description: 'Reputation for user',
      type: 'number',
      example: 15,
    }),
    requiredDecorator,
    IsNumber(),
  );
}
