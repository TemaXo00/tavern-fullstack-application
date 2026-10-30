import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { LOG_MESSAGES } from '@org/validation-messages'
import { isBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export function IsAdminAction(options: { required: boolean }): PropertyDecorator {
  const requiredDecorator = options.required ? IsNotEmpty({ message: LOG_MESSAGES.IS_ADMIN.NOT_EMPTY }) : IsOptional()

  return applyDecorators(
    ApiProperty({
      description: 'Is admin action state',
      required: options.required,
      type: 'boolean',
      example: false,
    }),
    requiredDecorator,
    isBoolean,
  )
}
