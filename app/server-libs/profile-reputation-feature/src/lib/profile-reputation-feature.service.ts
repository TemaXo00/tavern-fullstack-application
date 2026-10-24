import { Injectable } from '@nestjs/common'
import { AuthValidateService } from '@org/auth-authorization-core'
import { Roles } from '@org/enums'
import { ProfileCacheUtil, ProfileDatabaseUtil, ProfileMessagesUtil, ProfileValidationUtil } from '@org/profile-utils'

import type {
  AddReputationInput,
  GetMyReputationInput,
  GetReputationByNicknameInput,
  PaginatedReputationOutput,
  ReputationOutput,
  ReputationServiceContract,
} from '@org/grpc-types'

@Injectable()
export class ProfileReputationFeatureService implements ReputationServiceContract {
  constructor(
    private readonly validate: AuthValidateService,
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly validationUtil: ProfileValidationUtil,
    private readonly messagesUtil: ProfileMessagesUtil,
    private readonly cacheUtil: ProfileCacheUtil
  ) {}

  async GetMyLogs(data: GetMyReputationInput): Promise<PaginatedReputationOutput> {
    const payload = await this.validate.Validate(data.validation)
    const profile = await this.validationUtil.checkUserExisting('by-id', payload.id)
    return await this.dbUtil.getReputationPaginatedLogs(profile.id, data.pagination)
  }

  async GetReputationByNickname(data: GetReputationByNicknameInput): Promise<PaginatedReputationOutput> {
    const profile = await this.validationUtil.checkUserExisting('by-nickname', data.nickname)
    return await this.dbUtil.getReputationPaginatedLogs(profile.id, data.pagination)
  }

  async AddReputation(data: AddReputationInput): Promise<ReputationOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const profile = await this.validationUtil.checkUserExisting('by-nickname', data.nickname)
    this.validationUtil.checkAddReputationNotCurrent(payload.id, profile.userId)
    this.validationUtil.checkProfileStatus(profile.currentActivity)
    const action = await this.dbUtil.createReputationEntry(profile.nickname, data.message, data.score)
    await this.cacheUtil.deleteCache(data.nickname)
    this.messagesUtil.sendChangeReputation({
      adminId: payload.id,
      userId: profile.userId,
      message: data.message,
      score: data.score,
    })
    return action
  }
}
