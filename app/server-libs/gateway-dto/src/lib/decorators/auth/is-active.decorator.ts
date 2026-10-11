import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_MESSAGES } from '@org/validation-messages';
import { isBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export function IsActive(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required
    ? IsNotEmpty({ message: AUTH_MESSAGES.IS_ACTIVE_VALIDATION.NOT_EMPTY })
    : IsOptional();

  return applyDecorators(
    ApiProperty({
      description: 'Is active state',
      required: options.required,
      type: 'boolean',
      example: false,
    }),
    requiredDecorator,
    isBoolean,
  );
}
