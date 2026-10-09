import { applyDecorators, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Validate } from '../validate.decorator.js';

import type { Roles } from '@org/enums';

interface IPOSTProtectedMethodOptions {
  path: string;
  operationDesc: string;
  createdDesc?: string;
  badRequestDesc?: string;
  unauthorizedDesc?: string;
  forbiddenDesc?: string;
  roles?: Roles[];
}

type IPOSTMethodOptions = Omit<
  IPOSTProtectedMethodOptions,
  'unauthorizedDesc' | 'forbiddenDesc' | 'roles'
>;

export const POSTMethod = (options: IPOSTMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiCreatedResponse({
      description: options.createdDesc || 'CREATED Response',
    }),
    ApiBadRequestResponse({
      description: options.badRequestDesc || 'Bad Request',
    }),
    Post(options.path),
  );
};

export const POSTProtected = (
  options: IPOSTProtectedMethodOptions,
): MethodDecorator => {
  return applyDecorators(
    ApiOperation({ description: options.operationDesc }),
    ApiBearerAuth(),
    ApiCreatedResponse({
      description: options.createdDesc || 'CREATED Response',
    }),
    ApiBadRequestResponse({
      description: options.badRequestDesc || 'Bad Request',
    }),
    ApiUnauthorizedResponse({
      description: options.unauthorizedDesc || 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: options.forbiddenDesc || 'Forbidden',
    }),
    Post(options.path),
    Validate(...(options.roles || [])),
  );
};
