import { Injectable } from '@nestjs/common'
import { Actions } from '@org/profile-database'
import { ProfileCacheUtil, ProfileDatabaseUtil, ProfileReputationUtil, ProfileValidationUtil } from '@org/profile-utils'
import {
  AdminBlockUserProfile,
  AdminSetUserActiveMessage,
  AdminUnblockUserMessage,
  DeleteUserMessage,
  USER_MESSAGES,
  UserChangeEmailMessage,
  UserSetInactiveMessage,
} from '@org/rmq-messages'
import { RmqLoggerUtil } from '@org/shared-utils'
import { PROFILE_MESSAGES } from '@org/validation-messages'

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
    const profile = await this.validationUtil.checkUserExisting('by-id', data.userId)
    await this.dbUtil.blockUser(data, this.reputationUtil.getScore(Actions.BLOCK))
    await this.cacheUtil.deleteCache(profile.nickname)
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.BLOCK_USER.LOG_METHOD,
      USER_MESSAGES.BLOCK,
      PROFILE_MESSAGES.BLOCK_USER.MESSAGE(data.blockedFrom, data.blockedUntil, data.blockReason),
    )
  }

  async handleUserEarlyUnblock(data: AdminUnblockUserMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting('by-id', data.userId)
    await this.dbUtil.earlyUnblockUser(data, this.reputationUtil.getScore(Actions.EARLY_UNBLOCK))
    await this.cacheUtil.deleteCache(profile.nickname)
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.EARLY_UNBLOCK.LOG_METHOD,
      USER_MESSAGES.EARLY_UNBLOCK,
      PROFILE_MESSAGES.EARLY_UNBLOCK.MESSAGE,
    )
  }

  async handleUserInactive(data: UserSetInactiveMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting('by-id', data.userId)
    await this.dbUtil.deactivateUser(data)
    await this.cacheUtil.deleteCache(profile.nickname)
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.INACTIVE.CONTEXT,
      USER_MESSAGES.SET_INACTIVE,
      PROFILE_MESSAGES.INACTIVE.MESSAGE(data.userId),
    )
  }

  async handleUserActive(data: AdminSetUserActiveMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting('by-id', data.userId)
    await this.dbUtil.activateUser(data)
    await this.cacheUtil.deleteCache(profile.nickname)
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.ACTIVATE_BY_ADMIN.CONTEXT,
      USER_MESSAGES.SET_ACTIVE,
      PROFILE_MESSAGES.ACTIVATE_BY_ADMIN.MESSAGE(data.userId, data.adminId),
    )
  }

  async handleUserChangeEmail(data: UserChangeEmailMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting('by-id', data.userId)
    await this.dbUtil.updateEmail(data.userId, data.newEmail)
    await this.cacheUtil.deleteCache(profile.nickname)
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.UPDATE_EMAIL.CONTEXT,
      USER_MESSAGES.EMAIL_CHANGE,
      PROFILE_MESSAGES.UPDATE_EMAIL.MESSAGE(data.userId, data.newEmail),
    )
  }

  async handleUserDeleted(data: DeleteUserMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting('by-id', data.userId)
    await this.dbUtil.deleteProfile(data.userId)
    await this.cacheUtil.deleteCache(profile.nickname)
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.DELETE_USER.CONTEXT,
      USER_MESSAGES.DELETE,
      PROFILE_MESSAGES.DELETE_USER.MESSAGE(data.userId),
    )
  }
}
