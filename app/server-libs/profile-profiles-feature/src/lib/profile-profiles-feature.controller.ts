import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ProfileProfilesFeatureService } from './profile-profiles-feature.service';

import type {
  GetMeInput,
  GetProfileByNicknameAdvancedInput,
  GetProfileByNicknameInput,
  GetProfilesAdvancedInput,
  GetProfilesInput,
  PaginatedProfilesAdvancedOutput,
  PaginatedProfilesBaseOutput,
  ProfileAdvancedOutput,
  ProfileBaseOutput,
  ProfileServiceContract,
  UpdateProfileInput,
} from '@org/grpc-types';

@Controller()
export class ProfileProfilesFeatureController implements ProfileServiceContract {
  constructor(private readonly service: ProfileProfilesFeatureService) {}

  @GrpcMethod('ProfileService', 'GetMe')
  async GetMe(data: GetMeInput): Promise<ProfileAdvancedOutput> {
    return this.service.GetMe(data);
  }

  @GrpcMethod('ProfileService', 'GetProfileByNicknameBase')
  async GetProfileByNicknameBase(
    data: GetProfileByNicknameInput,
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
  async UpdateProfile(
    data: UpdateProfileInput,
  ): Promise<ProfileAdvancedOutput> {
    return this.service.UpdateProfile(data);
  }
}
