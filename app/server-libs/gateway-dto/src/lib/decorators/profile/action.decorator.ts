import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Actions } from '@org/enums';
import { IsEnum, IsOptional } from 'class-validator';

export function Action(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Action for profile reputation',
      required: false,
      enum: Actions,
    }),
    IsOptional(),
    IsEnum(Actions),
  );
}
