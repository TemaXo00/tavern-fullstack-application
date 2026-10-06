import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function Name(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User name',
      example: 'Joe',
      type: 'string',
      minLength: 2,
      maxLength: 90,
    }),
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(90),
  );
}
