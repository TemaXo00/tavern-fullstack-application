import { applyDecorators, QueryMethod } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Validate } from '../validate.decorator.js';

import type { Roles } from '@org/enums';

interface IQUERYProtectedMethodOptions {
  path: string;
  summary: string;
  operationDesc: string;
  roles?: Roles[];
}

type IQUERYMethodOptions = Omit<IQUERYProtectedMethodOptions, 'roles'>;

export const QUERYMethod = (options: IQUERYMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiOkResponse({
      description: 'The request was processed successfully',
    }),
    ApiBadRequestResponse({
      description: 'The request contains invalid data',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
    }),
    QueryMethod(options.path),
  );
};

export const QUERYProtectedMethod = (
  options: IQUERYProtectedMethodOptions,
): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'The request was processed successfully',
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
    QueryMethod(options.path),
    Validate(...(options.roles || [])),
  );
};
