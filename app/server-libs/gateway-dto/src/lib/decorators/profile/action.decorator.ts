import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Actions } from '@org/enums';
import { PROFILE_MESSAGES } from '@org/validation-messages';
import { IsEnum, IsOptional } from 'class-validator';

export function Action(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Action for profile reputation',
      required: false,
      enum: Actions,
    }),
    IsOptional(),
    IsEnum(Actions, { message: PROFILE_MESSAGES.ACTION_VALIDATION.ENUM }),
  );
}
