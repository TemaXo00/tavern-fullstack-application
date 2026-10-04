import { Injectable } from '@nestjs/common';
import { Actions } from '@org/profile-database';
import {
  ProfileCacheUtil,
  ProfileDatabaseUtil,
  ProfileReputationUtil,
  ProfileValidationUtil,
} from '@org/profile-utils';
import { RmqLoggerUtil } from '@org/shared-utils';
import {
  AdminBlockUserProfile,
  AdminSetUserActiveMessage,
  AdminUnblockUserMessage,
  DeleteUserMessage,
  USER_MESSAGES,
  UserChangeEmailMessage,
  UserSetInactiveMessage,
} from '@org/types';

@Injectable()
export class UserRmqFeatureService {
  constructor(
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly reputationUtil: ProfileReputationUtil,
    private readonly cacheUtil: ProfileCacheUtil,
    private readonly validationUtil: ProfileValidationUtil,
    private readonly logUtil: RmqLoggerUtil,
  ) {}

  async handleUserBlock(data: AdminBlockUserProfile): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      data.userId,
    );
    await this.dbUtil.blockUser(
      data,
      this.reputationUtil.getScore(Actions.BLOCK),
    );
    await this.cacheUtil.deleteCache(profile.nickname);
    this.logUtil.logSuccess(
      'Update Status',
      USER_MESSAGES.BLOCK,
      `User with id ${data.userId}. Block reason: ${data.blockReason}. Blocked until: ${data.blockedUntil.toISOString()}`,
    );
  }

  async handleUserUnblock(data: AdminUnblockUserMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      data.userId,
    );
    await this.dbUtil.unblockUser(
      data,
      this.reputationUtil.getScore(Actions.EARLY_UNBLOCK),
    );
    await this.cacheUtil.deleteCache(profile.nickname);
    this.logUtil.logSuccess(
      'Update Status',
      USER_MESSAGES.UNBLOCK,
      `User ${data.userId} unblocked by admin ${data.adminId}`,
    );
  }

  async handleUserInactive(data: UserSetInactiveMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      data.userId,
    );
    await this.dbUtil.deactivateUser(data);
    await this.cacheUtil.deleteCache(profile.nickname);
    this.logUtil.logSuccess(
      'Update Activity',
      USER_MESSAGES.SET_INACTIVE,
      `User with ID ${data.userId} deactivated`,
    );
  }

  async handleUserActive(data: AdminSetUserActiveMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      data.userId,
    );
    await this.dbUtil.activateUser(data);
    await this.cacheUtil.deleteCache(profile.nickname);
    this.logUtil.logSuccess(
      'Update Activity',
      USER_MESSAGES.SET_ACTIVE,
      `User with ID ${data.userId} activated by admin with ID ${data.adminId}`,
    );
  }

  async handleUserChangeEmail(data: UserChangeEmailMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      data.userId,
    );
    await this.dbUtil.updateEmail(data.userId, data.newEmail);
    await this.cacheUtil.deleteCache(profile.nickname);
    this.logUtil.logSuccess(
      'Update Email',
      USER_MESSAGES.EMAIL_CHANGE,
      `User with id ${data.userId} changed email to ${data.newEmail}`,
    );
  }

  async handleUserDeleted(data: DeleteUserMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      data.userId,
    );
    await this.dbUtil.deleteProfile(data.userId);
    await this.cacheUtil.deleteCache(profile.nickname);
    this.logUtil.logSuccess(
      'Delete User',
      USER_MESSAGES.DELETE,
      `User with id ${data.userId} deleted successfully`,
    );
  }
}
