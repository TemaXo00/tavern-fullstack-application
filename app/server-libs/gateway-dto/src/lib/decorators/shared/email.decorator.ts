import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_CONFIG } from '@org/validation-config';
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
    MinLength(AUTH_CONFIG.EMAIL.MIN_LENGTH),
    IsEmail({
      allow_ip_domain: AUTH_CONFIG.EMAIL.ALLOW_IP_DOMAINS,
    }),
  );
}
