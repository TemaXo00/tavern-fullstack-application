import { Injectable } from '@nestjs/common';
import { EventRmqDatabaseUtil, EventRmqValidateUtil } from '@org/event-utils';
import {
  AdminBlockUserEvent,
  DeleteUserMessage,
  UserChangeEmailMessage,
} from '@org/rmq-messages';
import { RmqLoggerUtil } from '@org/shared-utils';
import { EVENT_MESSAGES } from '@org/validation-messages';

@Injectable()
export class UserRmqService {
  constructor(
    private readonly dbUtil: EventRmqDatabaseUtil,
    private readonly validation: EventRmqValidateUtil,
    private readonly logger: RmqLoggerUtil,
  ) {}

  async handleUserBlocked(data: AdminBlockUserEvent): Promise<void> {
    if (
      !(await this.validation.isUserExisting(data.userId)) ||
      !(await this.validation.isUserExisting(data.adminId))
    ) {
      return;
    }
    await this.dbUtil.blockUser(data);
    this.logger.logSuccess(
      EVENT_MESSAGES.USER_SNAPHSOT_BLOCK_SUCCESS.CONTEXT,
      EVENT_MESSAGES.USER_SNAPHSOT_BLOCK_SUCCESS.METHOD(
        data.userId,
        data.adminId,
      ),
    );
  }

  async handleUserChangeState(userId: string, state: boolean): Promise<void> {
    if (!(await this.validation.isUserExisting(userId))) {
      return;
    }
    await this.dbUtil.updateUserActivityState(userId, state);
    this.logger.logSuccess(
      EVENT_MESSAGES.USER_SNAPHSOT_CHANGE_STATE_SUCCESS.CONTEXT,
      EVENT_MESSAGES.USER_SNAPHSOT_CHANGE_STATE_SUCCESS.METHOD(userId, state),
    );
  }

  async handleUserChangeEmail(data: UserChangeEmailMessage): Promise<void> {
    if (!(await this.validation.isUserExisting(data.userId))) {
      return;
    }
    await this.dbUtil.updateUserEmail(data.userId, data.newEmail);
    this.logger.logSuccess(
      EVENT_MESSAGES.USER_SNAPHSOT_CHANGE_EMAIL_SUCCESS.CONTEXT,
      EVENT_MESSAGES.USER_SNAPHSOT_CHANGE_EMAIL_SUCCESS.METHOD(data.userId),
    );
  }

  async handleUserDeleted(data: DeleteUserMessage): Promise<void> {
    if (!(await this.validation.isUserExisting(data.userId))) {
      return;
    }
    await this.dbUtil.softDeleteUser(data.userId);
    this.logger.logSuccess(
      EVENT_MESSAGES.USER_SOFT_DELETE_SUCCESS.CONTEXT,
      EVENT_MESSAGES.USER_SOFT_DELETE_SUCCESS.METHOD(data.userId),
    );
  }
}
