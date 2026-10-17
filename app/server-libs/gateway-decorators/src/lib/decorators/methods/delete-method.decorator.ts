import { applyDecorators, Delete } from '@nestjs/common'
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

interface IDELETEProtectedMethodOptions {
  path: string
  summary: string
  operationDesc: string
  roles?: Roles[]
}

type IDELETEMethodOptions = Omit<IDELETEProtectedMethodOptions, 'roles'>

export const DELETEMethod = (options: IDELETEMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiOkResponse({
      description: 'The resource was deleted successfully',
    }),
    ApiBadRequestResponse({
      description: 'The request contains invalid data',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
    }),
    Delete(options.path),
  )
}

export const DELETEProtectedMethod = (options: IDELETEProtectedMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'The resource was deleted successfully',
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
    Delete(options.path),
    Validate(...(options.roles || [])),
  )
}
