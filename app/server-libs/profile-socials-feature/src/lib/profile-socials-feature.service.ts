import { Injectable } from '@nestjs/common'
import { AuthValidateService } from '@org/auth-authorization-core'
import { ProfileDatabaseUtil, ProfileValidationUtil } from '@org/profile-utils'

import type {
  AllSocialsOutput,
  CreateSocialInput,
  DeleteSocialInput,
  Empty,
  GetMySocialsInput,
  GetOtherUserSocialsInput,
  SocialOutput,
  SocialServiceContract,
} from '@org/grpc-types'

@Injectable()
export class ProfileSocialsFeatureService implements SocialServiceContract {
  constructor(
    private readonly validate: AuthValidateService,
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly validationUtil: ProfileValidationUtil,
  ) {}

  async GetMySocials(data: GetMySocialsInput): Promise<AllSocialsOutput> {
    const payload = await this.validate.Validate(data.validation)
    const profile = await this.validationUtil.checkUserExisting('by-id', payload.id)
    return await this.dbUtil.getListOfSocials(profile.id)
  }

  async GetSocialsByNickname(data: GetOtherUserSocialsInput): Promise<AllSocialsOutput> {
    const profile = await this.validationUtil.checkUserExisting('by-nickname', data.nickname)
    return await this.dbUtil.getListOfSocials(profile.id)
  }

  async CreateSocial(data: CreateSocialInput): Promise<SocialOutput> {
    const payload = await this.validate.Validate(data.validation)
    const profile = await this.validationUtil.checkUserExisting('by-id', payload.id)
    await this.validationUtil.checkSocialsCount(profile.id)
    await this.validationUtil.checkSocialUnique(profile.id, data.socialName)
    const response = await this.dbUtil.createSocial(profile.id, {
      socialName: data.socialName,
      socialUrl: data.socialUrl,
    })
    return response
  }

  async DeleteSocial(data: DeleteSocialInput): Promise<Empty> {
    const payload = await this.validate.Validate(data.validation)
    const profile = await this.validationUtil.checkUserExisting('by-id', payload.id)
    const social = await this.validationUtil.checkSocialExisting(data.socialId)
    this.validationUtil.checkSocialOwner(profile.id, social.profileId)
    await this.dbUtil.deleteSocial(data.socialId)
    return {}
  }
}
