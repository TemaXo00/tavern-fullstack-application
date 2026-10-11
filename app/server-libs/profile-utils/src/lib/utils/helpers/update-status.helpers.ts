import { Injectable } from '@nestjs/common';
import { ProfileDatabaseService } from '@org/profile-database';
import { RmqLoggerUtil } from '@org/shared-utils';
import { PROFILE_MESSAGES } from '@org/validation-messages';

import {
  ActivityManipulateOptions,
  BlockManipulateOptions,
} from './types.helper';

@Injectable()
export class ProfileUpdateStatusHelper {
  constructor(
    private readonly db: ProfileDatabaseService,
    private readonly logUtil: RmqLoggerUtil,
  ) {}

  async manipulateBlock(options: BlockManipulateOptions): Promise<void> {
    await this.db.$transaction(async (tx) => {
      const profile = await tx.profile.update({
        where: {
          userId: options.userId,
        },
        data: {
          currentActivity: options.updatingActivity,
          reputationScore: { increment: options.reputationScore },
        },
      });
      await tx.profileActivity.create({
        data: {
          profileId: profile.id,
          status: options.updatingActivity,
        },
      });
      await tx.reputation.create({
        data: {
          profileId: profile.id,
          score: options.reputationScore,
          message: options.message,
          action: options.action,
        },
      });
    });
  }

  async manipulateActivity(options: ActivityManipulateOptions): Promise<void> {
    await this.db.$transaction(async (tx) => {
      const profiles = await tx.profile.updateManyAndReturn({
        where: {
          userId: options.userId,
        },
        data: {
          currentActivity: options.updatingActivity,
        },
      });
      if (profiles.length === 0) {
        this.logUtil.logWarning(
          PROFILE_MESSAGES.UPDATE_ACITIVITY_WARNING.CONTEXT,
          options.logMethod,
          PROFILE_MESSAGES.UPDATE_ACITIVITY_WARNING.MESSAGE,
        );
        return;
      }
      const updatedProfile = profiles[0];
      await tx.profileActivity.create({
        data: {
          profileId: updatedProfile.id,
          status: options.updatingActivity,
        },
      });
    });
  }
}
