import { Injectable } from '@nestjs/common';
import { AuthValidateService } from '@org/auth-core';
import {
  ProfileCacheUtil,
  ProfileDatabaseUtil,
  ProfileMapUtil,
  ProfileMessagesUtil,
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
    private readonly messagesUtil: ProfileMessagesUtil,
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
    const payload = await this.validate.validateWithRoles(data.validation, [
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
    this.messagesUtil.sendAdminCheckProfile({
      adminId: payload.id,
      userId: profile.userId,
    });
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
    const payload = await this.validate.validateWithRoles(data.validation, [
      Roles.ADMIN,
      Roles.MODERATOR,
    ]);
    if (
      data.pagination.birthDateFrom ||
      data.pagination.birthDateTo ||
      (data.pagination.birthDateFrom && data.pagination.birthDateTo)
    ) {
      this.validationUtil.checkBirthDateQuery(
        data.pagination.birthDateFrom,
        data.pagination.birthDateTo,
      );
    }
    if (data.pagination.reputationFrom && data.pagination.reputationTo) {
      this.validationUtil.validateReputationInQuery(
        data.pagination.reputationFrom,
        data.pagination.reputationTo,
      );
    }
    this.messagesUtil.sendAdminGetPaginatedProfiles({
      adminId: payload.id,
      query: data.pagination,
    });
    return await this.dbUtil.getProfilesWithAdvancedPagination(data.pagination);
  }

  async UpdateProfile(
    data: UpdateProfileInput,
  ): Promise<ProfileAdvancedOutput> {
    this.validationUtil.validateUpdateInput(data.data);
    const payload = await this.validate.Validate(data.validation);
    const current = await this.validationUtil.checkUserExisting(
      'by-id',
      payload.id,
    );
    if (data.data.nickname && current.nickname !== data.data.nickname) {
      await this.validationUtil.checkUniqueNickname(data.data.nickname);
    }
    if (data.data.birthDate) {
      this.validationUtil.checkUpdatedBirthDate(data.data.birthDate);
    }
    await this.cacheUtil.deleteCache(current.nickname);
    this.messagesUtil.sendUserUpdateProfile({
      userId: payload.id,
      data: data.data,
    });
    return this.dbUtil.updateProfile(payload.id, data.data);
  }
}
