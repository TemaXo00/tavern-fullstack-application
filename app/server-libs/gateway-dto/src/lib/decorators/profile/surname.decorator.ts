import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function Surname(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User surname',
      example: 'Doe',
      type: 'string',
      required: false,
      minLength: 2,
      maxLength: 90,
    }),
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(90),
  );
}
