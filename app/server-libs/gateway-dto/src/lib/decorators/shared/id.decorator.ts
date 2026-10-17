import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { SHARED_MESSAGES } from '@org/validation-messages';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export function Id(required = true): PropertyDecorator {
  const requiredDecorator = required ? IsNotEmpty({ message: SHARED_MESSAGES.ID_VALIDATION.NOT_EMPTY }) : IsOptional();
  return applyDecorators(
    ApiProperty({
      description: `ID with UUID v7 format`,
      example: 'valid-uuid-v7',
      type: 'string',
      required,
    }),
    requiredDecorator,
    IsString({ message: SHARED_MESSAGES.ID_VALIDATION.TYPE }),
    IsUUID(7, { message: SHARED_MESSAGES.ID_VALIDATION.UUID }),
  );
}
