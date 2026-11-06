import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { ProfileSocialsFeatureService } from './profile-socials-feature.service'

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

@Controller()
export class ProfileSocialFeatureController implements SocialServiceContract {
  constructor(private readonly service: ProfileSocialsFeatureService) {}

  @GrpcMethod('SocialService', 'GetMySocials')
  async GetMySocials(data: GetMySocialsInput): Promise<AllSocialsOutput> {
    return await this.service.GetMySocials(data)
  }

  @GrpcMethod('SocialService', 'GetSocialsByNickname')
  async GetSocialsByNickname(data: GetOtherUserSocialsInput): Promise<AllSocialsOutput> {
    return await this.service.GetSocialsByNickname(data)
  }

  @GrpcMethod('SocialService', 'CreateSocial')
  async CreateSocial(data: CreateSocialInput): Promise<SocialOutput> {
    return await this.service.CreateSocial(data)
  }

  @GrpcMethod('SocialService', 'DeleteSocial')
  async DeleteSocial(data: DeleteSocialInput): Promise<Empty> {
    return await this.service.DeleteSocial(data)
  }
}
