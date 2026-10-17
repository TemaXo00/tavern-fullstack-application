import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AuthCoreAuthorizeUtil, AuthCoreCacheUtil, AuthCoreJWTUtil } from '@org/auth-authorization-utils';
import { ROLE_TO_GRPC, Roles } from '@org/enums';
import { StringValidationUtil } from '@org/shared-utils';
import { AUTH_MESSAGES } from '@org/validation-messages';

import type { UserPayload, ValidateInput } from '@org/grpc-types';

@Injectable()
export class AuthValidateService {
  constructor(
    private readonly jwtUtil: AuthCoreJWTUtil,
    private readonly cacheUtil: AuthCoreCacheUtil,
    private readonly authUtil: AuthCoreAuthorizeUtil,
    private readonly stringUtil: StringValidationUtil,
  ) {}

  async Validate(data: ValidateInput): Promise<UserPayload> {
    this.validateInputFields(data);
    const payload = this.jwtUtil.validateAccessToken(data.accessToken);
    const redisPayload = await this.cacheUtil.getPayload(payload.id, payload.sessionId);
    if (redisPayload) {
      return redisPayload;
    }
    await this.authUtil.validateSession(payload.id, payload.sessionId, data.accessToken, 'access', data.session, true);
    await this.cacheUtil.setPayload(payload);
    return payload;
  }

  async validateWithRoles(data: ValidateInput, allowedRoles: Roles[]): Promise<UserPayload> {
    const payload = await this.Validate(data);

    const allowedGrpcRoles = allowedRoles.map((r) => ROLE_TO_GRPC[r]);

    if (!allowedGrpcRoles.includes(payload.role)) {
      throw new RpcException({
        message: AUTH_MESSAGES.ACCESS_DENIED,
        code: status.PERMISSION_DENIED,
      });
    }

    return payload;
  }

  private validateInputFields(validation: ValidateInput): void {
    if (!validation) {
      throw new RpcException({
        message: AUTH_MESSAGES.VALIDATION_DATA_REQUIRED,
        code: status.INVALID_ARGUMENT,
      });
    }

    if (!validation.session) {
      throw new RpcException({
        message: AUTH_MESSAGES.SESSION_REQUIRED,
        code: status.INVALID_ARGUMENT,
      });
    }

    this.stringUtil.validateAnyString(validation.accessToken, AUTH_MESSAGES.INVALID_TOKEN_STRING);
    this.stringUtil.validateAnyString(validation.session.browser, AUTH_MESSAGES.INVALID_BROWSER_STRING);
    this.stringUtil.validateAnyString(validation.session.ip, AUTH_MESSAGES.INVALID_IP_STRING);
    this.stringUtil.validateAnyString(validation.session.device, AUTH_MESSAGES.INVALID_DEVICE_STRING);
    this.stringUtil.validateAnyString(validation.session.os, AUTH_MESSAGES.INVALID_OS_STRING);
  }
}
