import { Injectable } from '@nestjs/common';
import { AuthValidateService } from '@org/auth-core';
import { ProfileDatabaseUtil, ProfileValidationUtil } from '@org/profile-utils';
import {
  Roles,
  type ActivityServiceContract,
  type GetActivityByNicknameInput,
  type GetMyActivityInput,
  type PaginatedActivityOutput,
} from '@org/types';

@Injectable()
export class ActivityFeatureService implements ActivityServiceContract {
  constructor(
    private readonly validate: AuthValidateService,
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly validationUtil: ProfileValidationUtil,
  ) {}

  async GetMyLogs(data: GetMyActivityInput): Promise<PaginatedActivityOutput> {
    const payload = await this.validate.Validate(data.validation);
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      payload.id,
    );
    return await this.dbUtil.getActivityPaginatedLogs(
      profile.id,
      data.pagination,
    );
  }

  async GetActivityByNickname(
    data: GetActivityByNicknameInput,
  ): Promise<PaginatedActivityOutput> {
    await this.validate.validateWithRoles(data.validation, [
      Roles.ADMIN,
      Roles.MODERATOR,
    ]);
    const profile = await this.validationUtil.checkUserExisting(
      'by-nickname',
      data.nickname,
    );
    return await this.dbUtil.getActivityPaginatedLogs(
      profile.id,
      data.pagination,
    );
  }
}
