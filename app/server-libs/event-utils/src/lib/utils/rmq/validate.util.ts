import { Injectable } from '@nestjs/common';
import { RmqLoggerUtil } from '@org/shared-utils';
import { EVENT_MESSAGES } from '@org/validation-messages';

import { EventRmqDatabaseUtil } from './database.util';

@Injectable()
export class EventRmqValidateUtil {
  constructor(
    private readonly dbUtil: EventRmqDatabaseUtil,
    private readonly logger: RmqLoggerUtil,
  ) {}

  async isUserExisting(id: string): Promise<boolean> {
    if (!(await this.dbUtil.getUser(id))) {
      this.logger.logError(
        EVENT_MESSAGES.USER_SNAPSHOT_EXISTING_ERROR.CONTEXT,
        EVENT_MESSAGES.USER_SNAPSHOT_EXISTING_ERROR.METHOD,
        EVENT_MESSAGES.USER_SNAPSHOT_EXISTING_ERROR.MESSAGE(id),
      );
      return false;
    }
    return true;
  }
}
