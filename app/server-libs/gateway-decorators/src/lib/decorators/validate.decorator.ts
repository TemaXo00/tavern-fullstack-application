import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { AuthJWTGuard, RolesGuard } from '@org/gateway-authorization'

import type { Roles } from '@org/enums'

export function Validate(...allowedRoles: Roles[]): MethodDecorator {
  return applyDecorators(SetMetadata('allowedRoles', allowedRoles), UseGuards(AuthJWTGuard, RolesGuard))
}
