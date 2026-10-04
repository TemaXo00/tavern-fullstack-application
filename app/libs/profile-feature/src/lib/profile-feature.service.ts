import { Injectable } from '@nestjs/common';
import { AuthValidateService } from '@org/auth-core';
import {
  ProfileCacheUtil,
  ProfileDatabaseUtil,
  ProfileMapUtil,
  ProfileValidationUtil,
} from '@org/profile-utils';
import {
  Roles,
  type GetMeInput,
  type GetProfileByNicknameAdvancedInput,
  type GetProfileByNicknameBaseInput,
  type GetProfilesAdvancedInput,
  type GetProfilesInput,
  type PaginatedProfilesAdvancedOutput,
  type PaginatedProfilesBaseOutput,
  type ProfileAdvancedOutput,
  type ProfileBaseOutput,
  type ProfileServiceContract,
  type UpdateProfileInput,
} from '@org/types';

@Injectable()
export class ProfileFeatureService implements ProfileServiceContract {
  constructor(
    private readonly validationUtil: ProfileValidationUtil,
    private readonly mapUtil: ProfileMapUtil,
    private readonly validate: AuthValidateService,
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly cacheUtil: ProfileCacheUtil,
  ) {}

  async GetMe(data: GetMeInput): Promise<ProfileAdvancedOutput> {
    const payload = await this.validate.Validate(data.validation);
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      payload.id,
    );
    const mappedProfile = this.mapUtil.mapAdvanced(profile);
    return mappedProfile;
  }

  async GetProfileByNicknameBase(
    data: GetProfileByNicknameBaseInput,
  ): Promise<ProfileBaseOutput> {
    const redisProfile = await this.cacheUtil.getBase(data.nickname);
    if (redisProfile) {
      return redisProfile;
    }
    const profile = await this.validationUtil.checkUserExisting(
      'by-nickname',
      data.nickname,
    );
    const mappedProfile = this.mapUtil.mapBase(profile);
    await this.cacheUtil.cacheBase(mappedProfile);
    return mappedProfile;
  }

  async GetProfileByNicknameAdvanced(
    data: GetProfileByNicknameAdvancedInput,
  ): Promise<ProfileAdvancedOutput> {
    await this.validate.validateWithRoles(data.validation, [
      Roles.ADMIN,
      Roles.MODERATOR,
    ]);
    const redisProfile = await this.cacheUtil.getAdvanced(data.nickname);
    if (redisProfile) {
      return redisProfile;
    }
    const profile = await this.validationUtil.checkUserExisting(
      'by-nickname',
      data.nickname,
    );
    const mappedProfile = this.mapUtil.mapAdvanced(profile);
    await this.cacheUtil.cacheAdvanced(mappedProfile);
    return mappedProfile;
  }

  async GetProfilesBase(
    data: GetProfilesInput,
  ): Promise<PaginatedProfilesBaseOutput> {
    return await this.dbUtil.getProfilesWithBasePagination(data.pagination);
  }

  async GetProfilesAdvanced(
    data: GetProfilesAdvancedInput,
  ): Promise<PaginatedProfilesAdvancedOutput> {
    await this.validate.validateWithRoles(data.validation, [
      Roles.ADMIN,
      Roles.MODERATOR,
    ]);
    return await this.dbUtil.getProfilesWithAdvancedPagination(data.pagination);
  }

  async UpdateProfile(
    data: UpdateProfileInput,
  ): Promise<ProfileAdvancedOutput> {
    const payload = await this.validate.Validate(data.validation);
    const current = await this.validationUtil.checkUserExisting(
      'by-id',
      payload.id,
    );
    if (data.data.nickname && current.nickname !== data.data.nickname) {
      await this.validationUtil.checkUniqueNickname(data.data.nickname);
    }
    await this.cacheUtil.deleteCache(current.nickname);
    return this.dbUtil.updateProfile(payload.id, data.data);
  }
}
