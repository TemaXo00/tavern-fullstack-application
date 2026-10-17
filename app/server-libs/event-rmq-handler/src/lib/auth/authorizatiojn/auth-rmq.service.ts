import { Injectable } from '@nestjs/common';
import { EventRmqDatabaseUtil, EventRmqValidateUtil } from '@org/event-utils';
import { AuthRegisteredMessage, AuthUserUnblockedMessage } from '@org/rmq-messages';
import { RmqLoggerUtil } from '@org/shared-utils';
import { EVENT_MESSAGES } from '@org/validation-messages';

@Injectable()
export class AuthRmqService {
  constructor(
    private readonly dbUtil: EventRmqDatabaseUtil,
    private readonly validation: EventRmqValidateUtil,
    private readonly logger: RmqLoggerUtil,
  ) {}

  async handleUserRegistered(data: AuthRegisteredMessage): Promise<void> {
    await this.dbUtil.createUserSnapshot(data);
    this.logger.logSuccess(
      EVENT_MESSAGES.USER_SHAPSHOT_CREATE_SUCCESS.CONTEXT,
      EVENT_MESSAGES.USER_SHAPSHOT_CREATE_SUCCESS.METHOD(data.id),
    );
  }

  async handleUserUnblocked(data: AuthUserUnblockedMessage): Promise<void> {
    if (!(await this.validation.isUserExisting(data.userId))) {
      return;
    }
    // Updates user isActive state to true
    await this.dbUtil.updateUserActivityState(data.userId, true);
    this.logger.logSuccess(
      EVENT_MESSAGES.USER_SHAPSHOT_UNBLOCK_SUCCESS.CONTEXT,
      EVENT_MESSAGES.USER_SHAPSHOT_UNBLOCK_SUCCESS.METHOD(data.userId),
    );
  }
}
