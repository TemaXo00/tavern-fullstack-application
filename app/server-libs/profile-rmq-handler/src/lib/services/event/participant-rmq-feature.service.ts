import { Injectable } from '@nestjs/common'
import { Actions } from '@org/enums'
import { ProfileCacheUtil, ProfileDatabaseUtil, ProfileReputationUtil, ProfileValidationUtil } from '@org/profile-utils'
import { ChangeParticipantStatusMessage, EVENT_PARTICIPANT_MESSAGES } from '@org/rmq-messages'
import { RmqLoggerUtil } from '@org/shared-utils'
import { PROFILE_MESSAGES } from '@org/validation-messages'

@Injectable()
export class ParticipantRmqService {
  constructor(
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly reputationUtil: ProfileReputationUtil,
    private readonly cacheUtil: ProfileCacheUtil,
    private readonly validationUtil: ProfileValidationUtil,
    private readonly logUtil: RmqLoggerUtil,
  ) {}

  async handleParticipantChangeStatus(data: ChangeParticipantStatusMessage): Promise<void> {
    const profile = await this.validationUtil.checkUserExisting('by-id', data.userId)
    const reputation = this.reputationUtil.getScore(Actions.EVENT)
    await this.dbUtil.createReputationEntry(
      profile.nickname,
      PROFILE_MESSAGES.PARTICIPATED_EVENT.MESSAGE(profile.nickname, reputation),
      reputation,
      Actions.EVENT,
    )
    await this.cacheUtil.deleteCache(profile.nickname)
    this.logUtil.logSuccess(
      PROFILE_MESSAGES.PARTICIPATED_EVENT.LOG_METHOD,
      EVENT_PARTICIPANT_MESSAGES.EVENT_CHANGE_STATUS,
      PROFILE_MESSAGES.PARTICIPATED_EVENT.MESSAGE(data.userId, reputation),
    )
  }
}
