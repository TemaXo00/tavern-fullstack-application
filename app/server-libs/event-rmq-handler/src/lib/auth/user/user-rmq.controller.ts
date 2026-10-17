import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  type AdminBlockUserEvent,
  type AdminSetUserActiveMessage,
  type AdminUnblockUserMessage,
  type DeleteUserMessage,
  USER_MESSAGES,
  type UserChangeEmailMessage,
  type UserSetInactiveMessage,
} from '@org/rmq-messages';

import { UserRmqService } from './user-rmq.service';

@Controller()
export class UserRmqController {
  constructor(private readonly service: UserRmqService) {}

  @EventPattern(USER_MESSAGES.BLOCK)
  async handleUserBlocked(@Payload() data: AdminBlockUserEvent): Promise<void> {
    await this.service.handleUserBlocked(data);
  }

  @EventPattern(USER_MESSAGES.EARLY_UNBLOCK)
  async handleUserEarlyUnblocked(
    @Payload() data: AdminUnblockUserMessage,
  ): Promise<void> {
    await this.service.handleUserChangeState(data.userId, true);
  }

  @EventPattern(USER_MESSAGES.EMAIL_CHANGE)
  async handleEmailChange(
    @Payload() data: UserChangeEmailMessage,
  ): Promise<void> {
    await this.service.handleUserChangeEmail(data);
  }

  @EventPattern(USER_MESSAGES.SET_INACTIVE)
  async handleUserSetInactive(
    @Payload() data: UserSetInactiveMessage,
  ): Promise<void> {
    await this.service.handleUserChangeState(data.userId, false);
  }

  @EventPattern(USER_MESSAGES.SET_ACTIVE)
  async handleUserSetActive(
    @Payload() data: AdminSetUserActiveMessage,
  ): Promise<void> {
    await this.service.handleUserChangeState(data.userId, true);
  }

  @EventPattern(USER_MESSAGES.DELETE)
  async handleUserDeleted(@Payload() data: DeleteUserMessage): Promise<void> {
    await this.service.handleUserDeleted(data);
  }
}
