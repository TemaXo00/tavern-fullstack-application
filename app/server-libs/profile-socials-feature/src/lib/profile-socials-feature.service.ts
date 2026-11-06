import { AuthValidateService } from '@org/auth-authorization-core'
import { ProfileCacheUtil, ProfileDatabaseUtil, ProfileMessagesUtil, ProfileValidationUtil } from '@org/profile-utils'

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

export class ProfileSocialsFeatureService implements SocialServiceContract {
  constructor(
    private readonly validate: AuthValidateService,
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly validationUtil: ProfileValidationUtil,
    private readonly cacheUtil: ProfileCacheUtil,
    private readonly messagesUtil: ProfileMessagesUtil,
  ) {}

  async GetMySocials(_data: GetMySocialsInput): Promise<AllSocialsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetSocialsByNickname(_data: GetOtherUserSocialsInput): Promise<AllSocialsOutput> {
    throw new Error('Method not implemented.')
  }

  async CreateSocial(_data: CreateSocialInput): Promise<SocialOutput> {
    throw new Error('Method not implemented.')
  }

  async DeleteSocial(_data: DeleteSocialInput): Promise<Empty> {
    throw new Error('Method not implemented.')
  }
}
