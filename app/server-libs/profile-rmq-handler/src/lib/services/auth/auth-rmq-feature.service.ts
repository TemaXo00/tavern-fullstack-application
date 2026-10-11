import { Injectable } from '@nestjs/common';
import { ProfileDatabaseUtil, ProfileValidationUtil } from '@org/profile-utils';
import {
  AUTHORIZATION_MESSAGES,
  AuthRegisteredMessage,
} from '@org/rmq-messages';
import { RmqLoggerUtil } from '@org/shared-utils';
import { PROFILE_MESSAGES } from '@org/validation-messages';

@Injectable()
export class AuthRmqFeatureService {
  constructor(
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly validationUtil: ProfileValidationUtil,
    private logUtil: RmqLoggerUtil,
  ) {}

  async handleUserRegistered(payload: AuthRegisteredMessage): Promise<void> {
    await this.dbUtil.createProfile(payload);
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.CREATE.CONTEXT,
      AUTHORIZATION_MESSAGES.REGISTER,
      PROFILE_MESSAGES.CREATE.MESSAGE(payload.id),
    );
  }

  async handleUserUnblock(userId: string): Promise<void> {
    await this.validationUtil.checkUserExisting('by-id', userId);
    await this.dbUtil.unblockUser(userId);
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.UNBLOCK.CONTEXT,
      AUTHORIZATION_MESSAGES.UNBLOCK,
      PROFILE_MESSAGES.UNBLOCK.MESSAGE(userId),
    );
  }
}
