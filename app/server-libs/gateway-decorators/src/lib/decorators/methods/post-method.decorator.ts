import { applyDecorators, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Validate } from '../validate.decorator.js';

import type { Roles } from '@org/enums';

interface IPOSTProtectedMethodOptions {
  path: string;
  summary: string;
  operationDesc: string;
  roles?: Roles[];
}

type IPOSTMethodOptions = Omit<IPOSTProtectedMethodOptions, 'roles'>;

export const POSTMethod = (options: IPOSTMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiCreatedResponse({
      description: 'The resource was created successfully',
    }),
    ApiBadRequestResponse({
      description: 'The request contains invalid data',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
    }),
    Post(options.path),
  );
};

export const POSTProtected = (options: IPOSTProtectedMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiBearerAuth(),
    ApiCreatedResponse({
      description: 'The resource was created successfully',
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
    Post(options.path),
    Validate(...(options.roles || [])),
  );
};
