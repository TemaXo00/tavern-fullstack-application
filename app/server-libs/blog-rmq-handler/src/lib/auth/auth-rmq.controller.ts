import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import {
  AUTHORIZATION_MESSAGES,
  type DeleteUserMessage,
  USER_MESSAGES,
  type AuthRegisteredMessage,
} from '@org/rmq-messages'

import { AuthRmqService } from './auth-rmq.service'

@Controller()
export class AuthRmqController {
  constructor(private readonly service: AuthRmqService) {}

  @EventPattern(AUTHORIZATION_MESSAGES.REGISTER)
  async handleUserRegistered(@Payload() data: AuthRegisteredMessage): Promise<void> {
    await this.service.handleUserRegistered(data)
  }

  @EventPattern(USER_MESSAGES.DELETE)
  async handleUserDeleted(@Payload() data: DeleteUserMessage): Promise<void> {
    await this.service.handleUserDeleted(data)
  }
}
