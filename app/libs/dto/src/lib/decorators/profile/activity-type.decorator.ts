import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { TokenStates } from '@org/types';
import { IsEnum, IsOptional } from 'class-validator';

export function Activity(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Token state for token',
      required: false,
      enum: TokenStates,
    }),
    IsOptional(),
    IsEnum(TokenStates),
  );
}
