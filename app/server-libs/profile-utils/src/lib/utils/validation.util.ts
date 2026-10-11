import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UpdateProfileRequestInput } from '@org/grpc-types';
import { Profile } from '@org/profile-database';
import { PROFILE_MESSAGES } from '@org/validation-messages';

import { ProfileDatabaseUtil } from './database.util';
import { SearchUserHelperType } from './helpers/types.helper';

@Injectable()
export class ProfileValidationUtil {
  constructor(private readonly db: ProfileDatabaseUtil) {}

  async checkUserExisting(
    type: SearchUserHelperType,
    input: string,
  ): Promise<Profile> {
    const profile = await this.db.getProfile(type, input);

    if (!profile) {
      throw new RpcException({
        message: PROFILE_MESSAGES.PROFILE_NOT_FOUND,
        code: status.NOT_FOUND,
      });
    }

    return profile;
  }

  async checkUniqueNickname(
    nickname: string,
    currentUserId?: string,
  ): Promise<void> {
    const existing = await this.db.getProfile('by-nickname', nickname);
    if (existing && existing.userId !== currentUserId) {
      throw new RpcException({
        message: PROFILE_MESSAGES.NICKNAME_TAKEN,
        code: status.ALREADY_EXISTS,
      });
    }
  }

  checkBirthDateQuery(birthDateFrom?: Date, birthDateTo?: Date): void {
    if (birthDateFrom && birthDateFrom >= new Date()) {
      throw new RpcException({
        message: PROFILE_MESSAGES.BIRTH_DATE_FUTURE,
        code: status.INVALID_ARGUMENT,
      });
    }
    if (birthDateTo && birthDateTo >= new Date()) {
      throw new RpcException({
        message: PROFILE_MESSAGES.BIRTH_DATE_FUTURE,
        code: status.INVALID_ARGUMENT,
      });
    }
    if (birthDateFrom && birthDateTo && birthDateFrom >= birthDateTo) {
      throw new RpcException({
        message: PROFILE_MESSAGES.BIRTH_DATE_FROM_FEWER,
      });
    }
  }

  checkUpdatedBirthDate(birthDate?: Date): void {
    if (birthDate && birthDate >= new Date()) {
      throw new RpcException({
        message: PROFILE_MESSAGES.BIRTH_DATE_FUTURE,
        code: status.INVALID_ARGUMENT,
      });
    }
  }

  validateUpdateInput(data: UpdateProfileRequestInput): void {
    if (!data) {
      throw new RpcException({
        message: PROFILE_MESSAGES.UPDATE_PROFILE_DATA_NOT_FOUND,
        code: status.DATA_LOSS,
      });
    }
  }

  validateReputationInQuery(from: number, to: number): void {
    if (from > to) {
      throw new RpcException({
        message: PROFILE_MESSAGES.REPUTATION_FROM_BIGGER,
        code: status.INVALID_ARGUMENT,
      });
    }
  }
}
