import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AUTH_CONFIG } from '@org/validation-config';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export function LocalName(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Local session name',
      example: 'My ASUS Session',
      type: 'string',
      minLength: AUTH_CONFIG.LOCAL_NAME.MIN_LENGTH,
      maxLength: AUTH_CONFIG.LOCAL_NAME.MAX_LENGTH,
    }),
    IsNotEmpty(),
    IsString(),
    Length(
      AUTH_CONFIG.LOCAL_NAME.MIN_LENGTH,
      AUTH_CONFIG.LOCAL_NAME.MAX_LENGTH,
    ),
  );
}
