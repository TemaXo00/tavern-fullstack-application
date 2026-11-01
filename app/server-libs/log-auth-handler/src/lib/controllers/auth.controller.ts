import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import { type AuthLoginMessage, AUTHORIZATION_MESSAGES, type AuthRegisteredMessage } from '@org/rmq-messages'

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
}
