import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RpcException } from '@nestjs/microservices'
import { SocialOutput, UpdateProfileRequestInput } from '@org/grpc-types'
import { ActivityType, Profile } from '@org/profile-database'
import { PROFILE_MESSAGES } from '@org/validation-messages'

import { ProfileDatabaseUtil } from './database.util'
import { SearchUserHelperType } from './helpers/types.helper'

@Injectable()
export class ProfileValidationUtil {
  private MAX_COUNT_OF_SOCIALS: number

  constructor(
    private readonly db: ProfileDatabaseUtil,
    protected readonly config: ConfigService,
  ) {
    this.MAX_COUNT_OF_SOCIALS = config.get<number>('TAVERN_SOCIALS_MAX_COUNT', 5)
  }

  async checkUserExisting(type: SearchUserHelperType, input: string): Promise<Profile> {
    const profile = await this.db.getProfile(type, input)

    if (!profile) {
      throw new RpcException({
        message: PROFILE_MESSAGES.PROFILE_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }

    return profile
  }

  async checkUniqueNickname(nickname: string, currentUserId?: string): Promise<void> {
    const existing = await this.db.getProfile('by-nickname', nickname)
    if (existing && existing.userId !== currentUserId) {
      throw new RpcException({
        message: PROFILE_MESSAGES.NICKNAME_TAKEN,
        code: status.ALREADY_EXISTS,
      })
    }
  }

  checkBirthDateQuery(birthDateFrom?: Date, birthDateTo?: Date): void {
    if (birthDateFrom && birthDateFrom >= new Date()) {
      throw new RpcException({
        message: PROFILE_MESSAGES.BIRTH_DATE_FUTURE,
        code: status.INVALID_ARGUMENT,
      })
    }
    if (birthDateTo && birthDateTo >= new Date()) {
      throw new RpcException({
        message: PROFILE_MESSAGES.BIRTH_DATE_FUTURE,
        code: status.INVALID_ARGUMENT,
      })
    }
    if (birthDateFrom && birthDateTo && birthDateFrom >= birthDateTo) {
      throw new RpcException({
        message: PROFILE_MESSAGES.BIRTH_DATE_FROM_FEWER,
      })
    }
  }

  checkUpdatedBirthDate(birthDate?: Date): void {
    if (birthDate && birthDate >= new Date()) {
      throw new RpcException({
        message: PROFILE_MESSAGES.BIRTH_DATE_FUTURE,
        code: status.INVALID_ARGUMENT,
      })
    }
  }

  validateUpdateInput(data: UpdateProfileRequestInput): void {
    if (!data) {
      throw new RpcException({
        message: PROFILE_MESSAGES.UPDATE_PROFILE_DATA_NOT_FOUND,
        code: status.DATA_LOSS,
      })
    }
  }

  validateReputationInQuery(from: number, to: number): void {
    if (from > to) {
      throw new RpcException({
        message: PROFILE_MESSAGES.REPUTATION_FROM_BIGGER,
        code: status.INVALID_ARGUMENT,
      })
    }
  }

  checkProfileStatus(activity: ActivityType): void {
    if (activity === 'BLOCKED' || activity === 'INACTIVE') {
      throw new RpcException({
        message: PROFILE_MESSAGES.USER_BLOCKED_OR_INACTIVE,
        code: status.UNAVAILABLE,
      })
    }
  }

  checkAddReputationNotCurrent(userId: string, profileId: string): void {
    if (userId === profileId) {
      throw new RpcException({
        message: PROFILE_MESSAGES.ADD_YOURSELF,
        code: status.INVALID_ARGUMENT,
      })
    }
  }

  async checkSocialsCount(profileId: string): Promise<void> {
    const count = await this.db.getCountOfSocials(profileId)
    if (count >= this.MAX_COUNT_OF_SOCIALS) {
      throw new RpcException({
        message: PROFILE_MESSAGES.CANT_ADD_SOCIAL(this.MAX_COUNT_OF_SOCIALS),
        code: status.ABORTED,
      })
    }
  }

  async checkSocialUnique(profileId: string, socialName: string): Promise<void> {
    const social = await this.db.getUniqueSocial(profileId, socialName)
    if (social) {
      throw new RpcException({
        message: PROFILE_MESSAGES.SOCIAL_UNIQUE,
        code: status.ALREADY_EXISTS,
      })
    }
  }

  async checkSocialExisting(id: string): Promise<SocialOutput> {
    const social = await this.db.getSocialById(id)
    if (!social) {
      throw new RpcException({
        message: PROFILE_MESSAGES.SOCIAL_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }
    return social
  }

  checkSocialOwner(profileId: string, socialProfileId: string): void {
    if (profileId !== socialProfileId) {
      throw new RpcException({
        message: PROFILE_MESSAGES.SOCIAL_NOT_CURRENT_PROFILE,
        code: status.PERMISSION_DENIED,
      })
    }
  }
}
