import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export function Id(required = true): PropertyDecorator {
  const requiredDecorator = required ? IsNotEmpty() : IsOptional();
  return applyDecorators(
    ApiProperty({
      description: `ID with UUID v7 format`,
      example: 'valid-uuid-v7',
      type: 'string',
    }),
    requiredDecorator,
    IsString(),
    IsUUID(7),
  );
}
