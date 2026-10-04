import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ProfileFeatureService } from './profile-feature.service';

import type {
  GetMeInput,
  GetProfileByNicknameAdvancedInput,
  GetProfileByNicknameBaseInput,
  GetProfilesAdvancedInput,
  GetProfilesInput,
  PaginatedProfilesAdvancedOutput,
  PaginatedProfilesBaseOutput,
  ProfileAdvancedOutput,
  ProfileBaseOutput,
  ProfileServiceContract,
  UpdateProfileInput,
} from '@org/types';

@Controller()
export class ProfileFeatureController implements ProfileServiceContract {
  constructor(private readonly service: ProfileFeatureService) {}

  @GrpcMethod('ProfileService', 'GetMe')
  async GetMe(data: GetMeInput): Promise<ProfileAdvancedOutput> {
    return this.service.GetMe(data);
  }

  @GrpcMethod('ProfileService', 'GetProfileByNicknameBase')
  async GetProfileByNicknameBase(
    data: GetProfileByNicknameBaseInput,
  ): Promise<ProfileBaseOutput> {
    return this.service.GetProfileByNicknameBase(data);
  }

  @GrpcMethod('ProfileService', 'GetProfileByNicknameAdvanced')
  async GetProfileByNicknameAdvanced(
    data: GetProfileByNicknameAdvancedInput,
  ): Promise<ProfileAdvancedOutput> {
    return this.service.GetProfileByNicknameAdvanced(data);
  }

  @GrpcMethod('ProfileService', 'GetProfilesBase')
  async GetProfilesBase(
    data: GetProfilesInput,
  ): Promise<PaginatedProfilesBaseOutput> {
    return this.service.GetProfilesBase(data);
  }

  @GrpcMethod('ProfileService', 'GetProfilesAdvanced')
  async GetProfilesAdvanced(
    data: GetProfilesAdvancedInput,
  ): Promise<PaginatedProfilesAdvancedOutput> {
    return this.service.GetProfilesAdvanced(data);
  }

  @GrpcMethod('ProfileService', 'UpdateProfile')
  async UpdateProfile(data: UpdateProfileInput): Promise<ProfileBaseOutput> {
    return this.service.UpdateProfile(data);
  }
}
