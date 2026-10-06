import { Injectable } from '@nestjs/common';
import { ProfileDatabaseUtil, ProfileValidationUtil } from '@org/profile-utils';
import { RmqLoggerUtil } from '@org/shared-utils';
import { AUTHORIZATION_MESSAGES, AuthRegisteredMessage } from '@org/types';

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
      'Create Profile',
      AUTHORIZATION_MESSAGES.REGISTER,
      `userId: ${payload.id}`,
    );
  }

  async handleUserUnblock(userId: string): Promise<void> {
    await this.validationUtil.checkUserExisting('by-id', userId);
    await this.dbUtil.unblockUser(userId);
    this.logUtil.logSuccess(
      'Update Status',
      AUTHORIZATION_MESSAGES.UNBLOCK,
      `User ${userId}`,
    );
  }
}
