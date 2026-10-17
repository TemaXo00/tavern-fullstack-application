import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AUTHORIZATION_MESSAGES, type AuthUserUnblockedMessage, type AuthRegisteredMessage } from '@org/rmq-messages';

import { AuthRmqService } from './auth-rmq.service';

@Controller()
export class AuthRmqController {
  constructor(private readonly service: AuthRmqService) {}

  @EventPattern(AUTHORIZATION_MESSAGES.REGISTER)
  async handleUserRegistered(@Payload() data: AuthRegisteredMessage): Promise<void> {
    await this.service.handleUserRegistered(data);
  }

  @EventPattern(AUTHORIZATION_MESSAGES.UNBLOCK)
  async handleUserUnblocked(@Payload() data: AuthUserUnblockedMessage): Promise<void> {
    await this.service.handleUserUnblocked(data);
  }
}
