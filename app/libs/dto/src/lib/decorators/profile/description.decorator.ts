import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export function Description(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'User Description',
      example:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      type: 'string',
      minLength: 1,
      maxLength: 255,
    }),
    IsOptional(),
    IsString(),
    MinLength(1),
    MaxLength(255),
  );
}
