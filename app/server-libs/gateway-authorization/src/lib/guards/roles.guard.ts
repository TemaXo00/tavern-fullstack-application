import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLE_TO_GRPC, Roles } from '@org/enums'
import { AUTH_MESSAGES } from '@org/validation-messages'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<Roles[]>('allowedRoles', context.getHandler())

    if (!allowedRoles || allowedRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED)
    }

    const allowedGrpcRoles = allowedRoles.map((r) => ROLE_TO_GRPC[r])

    if (!allowedGrpcRoles.includes(user.role)) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCESS_DENIED)
    }

    return true
  }
}
