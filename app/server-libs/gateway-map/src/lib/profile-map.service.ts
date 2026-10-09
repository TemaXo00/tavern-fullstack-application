import { Injectable } from '@nestjs/common';
import {
  ACTIONS_TO_GRPC,
  ACTIVITY_TO_GRPC,
  GRPC_TO_ACTIONS,
  GRPC_TO_ACTIVITY,
} from '@org/enums';
import {
  ActivityOutput,
  ActivityPaginationInput,
  ActivityPaginationOutput,
  ProfileAdvancedOutput,
  ProfileBaseOutput,
  ProfileListOutput,
  ProfilePaginationAdvancedInput,
  ProfilePaginationAdvancedOutput,
  ReputationOutput,
  ReputationPaginationInput,
  ReputationPaginationOutput,
} from '@org/grpc-types';
import {
  ActivityPaginationSharedInput,
  ActivityPaginationSharedOutput,
  ActivitySharedOutput,
  ProfileAdvancedSharedOutput,
  ProfileBaseSharedOutput,
  ProfileListSharedOutput,
  ProfilePaginationAdvancedSharedInput,
  ProfilePaginationAdvancedSharedOutput,
  ReputationPaginationSharedInput,
  ReputationPaginationSharedOutput,
  ReputationSharedOutput,
} from '@org/shared-types';

@Injectable()
export class ProfileGatewayMapService {
  mapProfileBaseOutput(response: ProfileBaseOutput): ProfileBaseSharedOutput {
    return {
      ...response,
      currentActivity: GRPC_TO_ACTIVITY[response.currentActivity],
    };
  }

  mapProfileAdvancedOutput(
    response: ProfileAdvancedOutput,
  ): ProfileAdvancedSharedOutput {
    return {
      ...response,
      currentActivity: GRPC_TO_ACTIVITY[response.currentActivity],
    };
  }

  mapProfileList(list: ProfileListOutput[]): ProfileListSharedOutput[] {
    if (!list || !Array.isArray(list)) {
      return [];
    }
    return list.map((item) => {
      return {
        ...item,
        currentActivity: GRPC_TO_ACTIVITY[item.currentActivity],
      };
    });
  }

  mapPaginationAdvanced(
    pagination: ProfilePaginationAdvancedOutput,
  ): ProfilePaginationAdvancedSharedOutput {
    return {
      ...pagination,
      currentActivity: pagination.currentActivity
        ? GRPC_TO_ACTIVITY[pagination.currentActivity]
        : undefined,
    };
  }

  mapPaginationAdvancedInput(
    pagination: ProfilePaginationAdvancedSharedInput,
  ): ProfilePaginationAdvancedInput {
    return {
      ...pagination,
      currentActivity: pagination.currentActivity
        ? ACTIVITY_TO_GRPC[pagination.currentActivity]
        : undefined,
    };
  }

  mapActivityPaginationInput(
    pagination: ActivityPaginationSharedInput,
  ): ActivityPaginationInput {
    return {
      ...pagination,
      activityType: pagination.activityType
        ? ACTIVITY_TO_GRPC[pagination.activityType]
        : undefined,
    };
  }

  mapActivityPaginationOutput(
    paginaton: ActivityPaginationOutput,
  ): ActivityPaginationSharedOutput {
    return {
      ...paginaton,
      activityType: paginaton.activityType
        ? GRPC_TO_ACTIVITY[paginaton.activityType]
        : undefined,
    };
  }

  mapActivityListOutput(list: ActivityOutput[]): ActivitySharedOutput[] {
    if (!list || !Array.isArray(list)) {
      return [];
    }
    return list.map((item) => {
      return {
        ...item,
        status: GRPC_TO_ACTIVITY[item.status],
      };
    });
  }

  mapReputationPaginationInput(
    pagination: ReputationPaginationSharedInput,
  ): ReputationPaginationInput {
    return {
      ...pagination,
      action: pagination.action
        ? ACTIONS_TO_GRPC[pagination.action]
        : undefined,
    };
  }

  mapReputationPaginationOutput(
    pagination: ReputationPaginationOutput,
  ): ReputationPaginationSharedOutput {
    return {
      ...pagination,
      action: pagination.action
        ? GRPC_TO_ACTIONS[pagination.action]
        : undefined,
    };
  }

  mapReputationListOutput(list: ReputationOutput[]): ReputationSharedOutput[] {
    if (!list || !Array.isArray(list)) {
      return [];
    }
    return list.map((item) => {
      return {
        ...item,
        action: GRPC_TO_ACTIONS[item.action],
      };
    });
  }
}
