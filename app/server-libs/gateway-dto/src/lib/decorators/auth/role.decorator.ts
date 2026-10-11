import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@org/enums';
import { AUTH_MESSAGES } from '@org/validation-messages';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export function Role(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required
    ? IsNotEmpty({ message: AUTH_MESSAGES.ROLE_VALIDATION.NOT_EMPTY })
    : IsOptional();

  return applyDecorators(
    ApiProperty({
      description: 'User role',
      required: options.required,
      enum: Roles,
    }),
    requiredDecorator,
    IsEnum(Roles, { message: AUTH_MESSAGES.ROLE_VALIDATION.ENUM }),
  );
}
