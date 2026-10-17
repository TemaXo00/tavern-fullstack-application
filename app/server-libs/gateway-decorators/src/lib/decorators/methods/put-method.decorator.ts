import { applyDecorators, Put } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { Validate } from '../validate.decorator.js'

import type { Roles } from '@org/enums'

interface IPUTProtectedMethodOptions {
  path: string
  summary: string
  operationDesc: string
  roles?: Roles[]
}

type IPUTMethodOptions = Omit<IPUTProtectedMethodOptions, 'roles'>

export const PUTMethod = (options: IPUTMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiOkResponse({
      description: 'The resource was updated successfully',
    }),
    ApiBadRequestResponse({
      description: 'The request contains invalid data',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
    }),
    Put(options.path),
  )
}

export const PUTProtectedMethod = (options: IPUTProtectedMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'The resource was updated successfully',
    }),
    ApiBadRequestResponse({
      description: 'The request contains invalid data',
    }),
    ApiUnauthorizedResponse({
      description: 'Authentication is required',
    }),
    ApiForbiddenResponse({
      description: 'Insufficient permissions to perform this action',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
    }),
    Put(options.path),
    Validate(...(options.roles || [])),
  )
}
