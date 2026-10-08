import { Injectable } from '@nestjs/common';
import { AuthValidateService } from '@org/auth-core';
import { ProfileDatabaseUtil, ProfileValidationUtil } from '@org/profile-utils';

import type {
  GetMyReputationInput,
  GetReputationByNicknameInput,
  PaginatedReputationOutput,
  ReputationServiceContract,
} from '@org/types';

@Injectable()
export class ReputationFeatureService implements ReputationServiceContract {
  constructor(
    private readonly validate: AuthValidateService,
    private readonly dbUtil: ProfileDatabaseUtil,
    private readonly validationUtil: ProfileValidationUtil,
  ) {}

  async GetMyLogs(
    data: GetMyReputationInput,
  ): Promise<PaginatedReputationOutput> {
    const payload = await this.validate.Validate(data.validation);
    const profile = await this.validationUtil.checkUserExisting(
      'by-id',
      payload.id,
    );
    return await this.dbUtil.getReputationPaginatedLogs(
      profile.id,
      data.pagination,
    );
  }

  async GetReputationByNickname(
    data: GetReputationByNicknameInput,
  ): Promise<PaginatedReputationOutput> {
    const profile = await this.validationUtil.checkUserExisting(
      'by-nickname',
      data.nickname,
    );
    return await this.dbUtil.getReputationPaginatedLogs(
      profile.id,
      data.pagination,
    );
  }
}
