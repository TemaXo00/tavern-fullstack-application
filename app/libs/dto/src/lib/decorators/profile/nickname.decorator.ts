import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function Nickname(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User Nickname',
      example: 'joe_doe',
      type: 'string',
      minLength: 3,
      maxLength: 80,
    }),
    IsOptional(),
    IsString(),
    MinLength(3),
    MaxLength(80),
  );
}
