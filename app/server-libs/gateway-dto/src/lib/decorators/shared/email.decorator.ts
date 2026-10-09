import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export function Email(requirable = true): PropertyDecorator {
  const requireDecorator = requirable ? IsNotEmpty() : IsOptional();

  return applyDecorators(
    ApiProperty({
      description: 'User email',
      type: 'string',
      example: 'user@example.com',
      required: requirable,
    }),
    requireDecorator,
    IsString(),
    MinLength(3),
    IsEmail({
      allow_ip_domain: false,
    }),
  );
}
