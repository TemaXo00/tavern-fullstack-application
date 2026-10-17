import { Injectable } from '@nestjs/common';
import { EventRmqDatabaseUtil, EventRmqValidateUtil } from '@org/event-utils';
import { UpdateProfile } from '@org/rmq-messages';
import { RmqLoggerUtil } from '@org/shared-utils';
import { EVENT_MESSAGES } from '@org/validation-messages';

@Injectable()
export class ProfilesRmqService {
  constructor(
    private readonly dbUtil: EventRmqDatabaseUtil,
    private readonly validation: EventRmqValidateUtil,
    private readonly logger: RmqLoggerUtil,
  ) {}

  async handleProfileChangeNickname(data: UpdateProfile): Promise<void> {
    if (data.data.nickname) {
      if (
        !(await this.validation.isNicknameFree(data.data.nickname)) ||
        !(await this.validation.isUserExisting(data.userId))
      ) {
        return;
      }

      await this.dbUtil.updateUserNickname(data.userId, data.data.nickname);
      this.logger.logSuccess(
        EVENT_MESSAGES.USER_CHANGE_NICKNAME_SUCCESS.CONTEXT,
        EVENT_MESSAGES.USER_CHANGE_NICKNAME_SUCCESS.METHOD(data.userId),
      );
    } else {
      this.logger.logWarning(
        EVENT_MESSAGES.USER_CHANGE_NICKNAME_WARNING.CONTEXT,
        EVENT_MESSAGES.USER_CHANGE_NICKNAME_WARNING.METHOD(data.userId),
        EVENT_MESSAGES.USER_CHANGE_NICKNAME_WARNING.MESSAGE,
      );
    }
  }
}
