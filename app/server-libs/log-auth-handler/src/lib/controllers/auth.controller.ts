import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  type AuthLogForgotPassword,
  type AuthLoginMessage,
  type AuthLogoutMessage,
  AUTHORIZATION_MESSAGES,
  type AuthRegisteredMessage,
  type AuthRestorePasswordMessage,
  type AuthUserUnblockedMessage,
} from '@org/rmq-messages'

@Controller()
export class AuthController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(AUTHORIZATION_MESSAGES.REGISTER)
  async handleRegisterMessage(@Payload() data: AuthRegisteredMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Authorization',
      action: AUTHORIZATION_MESSAGES.REGISTER,
      actionDesc: 'Register for new user. Public method',
      isAdminAction: false,
      logBody: data,
      actorId: data.id,
    })
  }

  @EventPattern(AUTHORIZATION_MESSAGES.LOGIN)
  async handleLoginMessage(@Payload() data: AuthLoginMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Authorization',
      action: AUTHORIZATION_MESSAGES.LOGIN,
      actionDesc: 'Login into account. Public method',
      isAdminAction: false,
      logBody: data,
      actorId: data.id,
    })
  }

  @EventPattern(AUTHORIZATION_MESSAGES.LOGOUT)
  async handleLogoutMessage(@Payload() data: AuthLogoutMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Authorization',
      action: AUTHORIZATION_MESSAGES.LOGOUT,
      actionDesc: 'Logout from account. Public method',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }

  @EventPattern(AUTHORIZATION_MESSAGES.FORGOT_PASSWORD)
  async handleForgotPasswordMessage(@Payload() data: AuthLogForgotPassword): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Authorization',
      action: AUTHORIZATION_MESSAGES.FORGOT_PASSWORD,
      actionDesc: 'User send request to reset password. Public method without authorization',
      isAdminAction: false,
      logBody: { email: data.email },
    })
  }

  @EventPattern(AUTHORIZATION_MESSAGES.RESTORE_PASSWORD)
  async handleRestorePassword(@Payload() data: AuthRestorePasswordMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Authorization',
      action: AUTHORIZATION_MESSAGES.RESTORE_PASSWORD,
      actionDesc: 'Restore password action. User changed his password',
      isAdminAction: false,
      logBody: data,
    })
  }

  @EventPattern(AUTHORIZATION_MESSAGES.UNBLOCK)
  async handleUserUnblock(@Payload() data: AuthUserUnblockedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Authorization',
      action: AUTHORIZATION_MESSAGES.UNBLOCK,
      actionDesc: 'User unblocked by expire blockedUntil date and time and successfully returned access to account',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }
}
