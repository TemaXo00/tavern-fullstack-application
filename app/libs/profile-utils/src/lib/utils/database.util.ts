import { Injectable } from '@nestjs/common';
import {
  Actions,
  ActivityType,
  type Profile,
  ProfileActivityWhereInput,
  ProfileDatabaseService,
  ProfileWhereInput,
  ReputationWhereInput,
} from '@org/profile-database';
import {
  DateMapUtil,
  PaginationUtil,
  RmqLoggerUtil,
  StringValidationUtil,
} from '@org/shared-utils';
import {
  ACTIONS_TO_GRPC,
  ACTIVITY_TO_GRPC,
  ActivityOutput,
  ActivityPaginationInput,
  AdminBlockUserProfile,
  AdminSetUserActiveMessage,
  AdminUnblockUserMessage,
  AuthRegisteredMessage,
  BaseUpdateProfileInput,
  GRPC_TO_ACTIONS,
  GRPC_TO_ACTIVITY,
  PaginatedActivityOutput,
  PaginatedProfilesAdvancedOutput,
  PaginatedProfilesBaseOutput,
  PaginatedReputationOutput,
  PaginationBaseInput,
  ProfileAdvancedOutput,
  ProfileListOutput,
  ProfilePaginationAdvancedInput,
  ProfilePaginationBaseInput,
  ReputationOutput,
  ReputationPaginationInput,
  UserSetInactiveMessage,
} from '@org/types';

import { SearchUserHelperType } from './helpers/types.helper';
import { ProfileUpdateStatusHelper } from './helpers/update-status.helpers';

@Injectable()
export class ProfileDatabaseUtil {
  constructor(
    private readonly db: ProfileDatabaseService,
    private readonly logUtil: RmqLoggerUtil,
    private readonly updateStatusHelper: ProfileUpdateStatusHelper,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil,
    private readonly mapDateUtil: DateMapUtil,
  ) {}

  // GET Methods

  async getProfile(
    type: SearchUserHelperType,
    input: string,
  ): Promise<Profile | null> {
    switch (type) {
      case 'by-id': {
        this.stringUtil.validateUUIDV7(input);
        break;
      }
      case 'by-nickname': {
        this.stringUtil.validateAnyString(input, 'Nickname');
        break;
      }
      default: {
        this.stringUtil.validateAnyString(input, 'String');
      }
    }
    return this.db.profile.findUnique({
      where: type === 'by-id' ? { userId: input } : { nickname: input },
    });
  }

  private async getProfileListOutput(
    where: ProfileWhereInput,
    skip: number,
    take: number,
  ): Promise<ProfileListOutput[]> {
    const profiles = await this.db.profile.findMany({
      where,
      skip,
      take,
      select: {
        nickname: true,
        avatarId: true,
        currentActivity: true,
      },
    });
    const mappedProfiles = profiles.map((profile) => {
      return {
        ...profile,
        currentActivity: ACTIVITY_TO_GRPC[profile.currentActivity],
      };
    });
    return mappedProfiles;
  }

  async getProfilesWithBasePagination(
    pagination: PaginationBaseInput,
  ): Promise<PaginatedProfilesBaseOutput> {
    const safePagination = pagination || {};
    const where = this.buildProfileBaseQuery(safePagination);
    const total = await this.db.profile.count({ where });
    const params = this.paginationUtil.getPaginationParams(
      total,
      safePagination.page,
      safePagination.limit,
    );
    return {
      pagination: {
        ...params,
        search: safePagination.search,
      },
      profiles: await this.getProfileListOutput(
        where,
        params.skip,
        params.limit,
      ),
    };
  }

  async getProfilesWithAdvancedPagination(
    pagination: ProfilePaginationAdvancedInput,
  ): Promise<PaginatedProfilesAdvancedOutput> {
    const safePagination = pagination || {};
    const birthDateFrom = safePagination.birthDateFrom
      ? this.mapDateUtil.mapDateAndValidate(safePagination.birthDateFrom)
      : undefined;
    const birthDateTo = safePagination.birthDateTo
      ? this.mapDateUtil.mapDateAndValidate(safePagination.birthDateTo)
      : undefined;

    const where = this.buildProfileAdvancedQuery({
      ...safePagination,
      birthDateFrom,
      birthDateTo,
    });
    const total = await this.db.profile.count({ where });
    const params = this.paginationUtil.getPaginationParams(
      total,
      safePagination.page,
      safePagination.limit,
    );
    return {
      pagination: {
        ...params,
        search: safePagination.search,
        email: safePagination.email,
        birthDateFrom,
        birthDateTo,
        reputationFrom: safePagination.reputationFrom,
        reputationTo: safePagination.reputationTo,
        currentActivity: safePagination.currentActivity,
      },
      profiles: await this.getProfileListOutput(
        where,
        params.skip,
        params.limit,
      ),
    };
  }

  private async getReputationListOutput(
    where: ReputationWhereInput,
    skip: number,
    take: number,
  ): Promise<ReputationOutput[]> {
    const reputationList = await this.db.reputation.findMany({
      where,
      skip,
      take,
      select: {
        action: true,
        message: true,
        score: true,
        createdAt: true,
      },
    });

    const mappedList = reputationList.map((item) => {
      return {
        ...item,
        action: ACTIONS_TO_GRPC[item.action],
      };
    });

    return mappedList;
  }

  async getReputationPaginatedLogs(
    profileId: string,
    pagination: ReputationPaginationInput,
  ): Promise<PaginatedReputationOutput> {
    const safePagination = pagination || {};
    const where = this.buildReputationQuery(profileId, safePagination);
    const total = await this.db.reputation.count({ where });
    const params = this.paginationUtil.getPaginationParams(
      total,
      safePagination.page,
      safePagination.limit,
    );
    return {
      pagination: {
        ...params,
        action: safePagination.action,
      },
      reputationLogs: await this.getReputationListOutput(
        where,
        params.skip,
        params.limit,
      ),
    };
  }

  private async getActivityListOutput(
    where: ProfileActivityWhereInput,
    skip: number,
    take: number,
  ): Promise<ActivityOutput[]> {
    const reputationList = await this.db.profileActivity.findMany({
      where,
      skip,
      take,
      select: {
        status: true,
        createdAt: true,
      },
    });

    const mappedList = reputationList.map((item) => {
      return {
        ...item,
        status: ACTIVITY_TO_GRPC[item.status],
      };
    });

    return mappedList;
  }

  async getActivityPaginatedLogs(
    profileId: string,
    pagination: ActivityPaginationInput,
  ): Promise<PaginatedActivityOutput> {
    const safePagination = pagination || {};
    const where = this.buildActivityQuery(profileId, safePagination);
    const total = await this.db.profileActivity.count({ where });
    const params = this.paginationUtil.getPaginationParams(
      total,
      safePagination.page,
      safePagination.limit,
    );
    return {
      pagination: {
        ...params,
        activityType: safePagination.activityType,
      },
      activityLogs: await this.getActivityListOutput(
        where,
        params.skip,
        params.limit,
      ),
    };
  }

  // CREATE Methods

  async createProfile(data: AuthRegisteredMessage): Promise<void> {
    await this.db.$transaction(async (tx) => {
      async function createActivityLog(profileId: string): Promise<void> {
        await tx.profileActivity.create({
          data: {
            profileId,
            status: ActivityType.ACTIVE,
          },
        });
      }

      const existing = await tx.profile.findUnique({
        where: { userId: data.id },
        select: {
          id: true,
          activity_logs: {
            select: { id: true },
            take: 1,
          },
        },
      });

      if (existing) {
        if (existing.activity_logs.length === 0) {
          this.logUtil.logWarning(
            'CreateProfile',
            'Register',
            'User exists but has no activity log, repairing',
          );
          await createActivityLog(existing.id);
        }
        return;
      }

      const profile = await tx.profile.create({
        data: {
          userId: data.id,
          nickname: data.id,
          email: data.email,
          currentActivity: ActivityType.ACTIVE,
        },
      });
      await createActivityLog(profile.id);
    });
  }

  // UPDATE Methods

  async blockUser(
    data: AdminBlockUserProfile,
    reputationScore: number,
  ): Promise<void> {
    const dateFrom = new Date(data.blockedFrom);
    const dateTo = new Date(data.blockedUntil);
    await this.updateStatusHelper.manipulateBlock({
      userId: data.userId,
      updatingActivity: ActivityType.BLOCKED,
      reputationScore,
      action: Actions.BLOCK,
      logMethod: 'Block',
      message: `The user blocked from ${dateFrom.toISOString()} to ${dateTo.toISOString()}. Reason: ${data.blockReason}`,
    });
  }

  async earlyUnblockUser(
    data: AdminUnblockUserMessage,
    reputationScore: number,
  ): Promise<void> {
    await this.updateStatusHelper.manipulateBlock({
      userId: data.userId,
      updatingActivity: ActivityType.ACTIVE,
      reputationScore,
      action: Actions.EARLY_UNBLOCK,
      logMethod: 'Early unblock',
      message: `The user has been unblocked due to changed circumstances.`,
    });
  }

  async unblockUser(userId: string): Promise<void> {
    await this.db.profile.update({
      where: {
        userId,
      },
      data: {
        currentActivity: ActivityType.ACTIVE,
      },
    });
  }

  async activateUser(data: AdminSetUserActiveMessage): Promise<void> {
    await this.updateStatusHelper.manipulateActivity({
      userId: data.userId,
      updatingActivity: ActivityType.ACTIVE,
      logMethod: 'Activate user',
    });
  }

  async deactivateUser(data: UserSetInactiveMessage): Promise<void> {
    await this.updateStatusHelper.manipulateActivity({
      userId: data.userId,
      updatingActivity: ActivityType.INACTIVE,
      logMethod: 'Deactivate user',
    });
  }

  async updateEmail(userId: string, newEmail: string): Promise<void> {
    await this.db.profile.update({
      where: { userId },
      data: { email: newEmail },
    });
  }

  async updateProfile(
    userId: string,
    data: BaseUpdateProfileInput,
  ): Promise<ProfileAdvancedOutput> {
    const mappedData = {
      ...data,
      birthDate: data.birthDate
        ? this.mapDateUtil.mapDateAndValidate(data.birthDate)
        : undefined,
    };
    const profile = await this.db.profile.update({
      where: { userId },
      data: mappedData,
    });
    return {
      ...profile,
      currentActivity: ACTIVITY_TO_GRPC[profile.currentActivity],
    };
  }

  // DELETE Methods

  async deleteProfile(userId: string): Promise<void> {
    await this.db.profile.delete({
      where: {
        userId,
      },
    });
  }

  // QUERY BUILDERS

  buildProfileBaseQuery(query: ProfilePaginationBaseInput): ProfileWhereInput {
    const where: ProfileWhereInput = {};

    if (query.search) {
      where.nickname = { contains: query.search, mode: 'insensitive' };
    }

    return where;
  }

  buildProfileAdvancedQuery(
    query: ProfilePaginationAdvancedInput,
  ): ProfileWhereInput {
    const where: ProfileWhereInput = {};

    if (query.search) {
      where.nickname = { contains: query.search, mode: 'insensitive' };
    }

    if (query.email) {
      where.email = { contains: query.email, mode: 'insensitive' };
    }

    if (query.currentActivity) {
      where.currentActivity = GRPC_TO_ACTIVITY[query.currentActivity];
    }

    if (query.birthDateFrom || query.birthDateTo) {
      where.birthDate = {};
      if (query.birthDateFrom) {
        where.birthDate.gte = query.birthDateFrom;
      }
      if (query.birthDateTo) {
        where.birthDate.lte = query.birthDateTo;
      }
    }

    if (
      query.reputationFrom !== undefined ||
      query.reputationTo !== undefined
    ) {
      where.reputationScore = {};
      if (query.reputationFrom !== undefined) {
        where.reputationScore.gte = query.reputationFrom;
      }
      if (query.reputationTo !== undefined) {
        where.reputationScore.lte = query.reputationTo;
      }
    }

    return where;
  }

  buildReputationQuery(
    profileId: string,
    query: ReputationPaginationInput,
  ): ReputationWhereInput {
    const where: ReputationWhereInput = {};

    where.profileId = profileId;

    if (query.search) {
      where.message = { contains: query.search, mode: 'insensitive' };
    }

    if (query.action) {
      where.action = GRPC_TO_ACTIONS[query.action];
    }

    return where;
  }

  buildActivityQuery(
    profileId: string,
    query: ActivityPaginationInput,
  ): ProfileActivityWhereInput {
    const where: ProfileActivityWhereInput = {};

    where.profileId = profileId;

    if (query.activityType) {
      where.status = GRPC_TO_ACTIVITY[query.activityType];
    }

    return where;
  }
}
