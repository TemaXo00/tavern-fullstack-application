import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Profile } from '@org/profile-database';
import { BaseUpdateProfileInput } from '@org/types';

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
        message: 'Profile not found',
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
        message: 'Nickname already taken',
        code: status.ALREADY_EXISTS,
      });
    }
  }

  checkBirthDateQuery(birthDateFrom?: Date, birthDateTo?: Date): void {
    if (birthDateFrom && birthDateFrom >= new Date()) {
      throw new RpcException({
        message: 'Birth date from cannot be in future',
        code: status.INVALID_ARGUMENT,
      });
    }
    if (birthDateTo && birthDateTo >= new Date()) {
      throw new RpcException({
        message: 'Birth date from cannot be in future',
        code: status.INVALID_ARGUMENT,
      });
    }
    if (birthDateFrom && birthDateTo && birthDateFrom >= birthDateTo) {
      throw new RpcException({
        message: 'Birth date from cannot be fewer, than birthDateTo',
      });
    }
  }

  checkUpdatedBirthDate(birthDate?: Date): void {
    if (birthDate && birthDate >= new Date()) {
      throw new RpcException({
        message: 'Birth date cannot be in future',
        code: status.INVALID_ARGUMENT,
      });
    }
  }

  validateUpdateInput(data: BaseUpdateProfileInput): void {
    if (!data) {
      throw new RpcException({
        message: 'Invalid update data',
        code: status.DATA_LOSS,
      });
    }
  }
}
