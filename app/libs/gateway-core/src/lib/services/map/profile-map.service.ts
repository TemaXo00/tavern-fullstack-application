import { Injectable } from '@nestjs/common';
import {
  ACTIONS_TO_GRPC,
  ACTIVITY_TO_GRPC,
  ActivityGatewayOutput,
  ActivityOutput,
  ActivityPaginationGatewayInput,
  ActivityPaginationGatewayOutput,
  ActivityPaginationInput,
  ActivityPaginationOutput,
  GRPC_TO_ACTIONS,
  GRPC_TO_ACTIVITY,
  ProfileAdvancedOutput,
  ProfileBaseOutput,
  ProfileGatewayAdvancedOutput,
  ProfileGatewayBaseOutput,
  ProfileGatewayListOutput,
  ProfileGatewayPaginationAdvancedOutput,
  ProfileListOutput,
  ProfilePaginationAdvancedGatewayInput,
  ProfilePaginationAdvancedInput,
  ProfilePaginationAdvancedOutput,
  ReputationGatewayOutput,
  ReputationOutput,
  ReputationPaginationGatewayInput,
  ReputationPaginationGatewayOutput,
  ReputationPaginationInput,
  ReputationPaginationOutput,
} from '@org/types';

@Injectable()
export class ProfileGatewayMapService {
  mapProfileBaseOutput(response: ProfileBaseOutput): ProfileGatewayBaseOutput {
    return {
      ...response,
      currentActivity: GRPC_TO_ACTIVITY[response.currentActivity],
    };
  }

  mapProfileAdvancedOutput(
    response: ProfileAdvancedOutput,
  ): ProfileGatewayAdvancedOutput {
    return {
      ...response,
      currentActivity: GRPC_TO_ACTIVITY[response.currentActivity],
    };
  }

  mapProfileList(list: ProfileListOutput[]): ProfileGatewayListOutput[] {
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
  ): ProfileGatewayPaginationAdvancedOutput {
    return {
      ...pagination,
      currentActivity: pagination.currentActivity
        ? GRPC_TO_ACTIVITY[pagination.currentActivity]
        : undefined,
    };
  }

  mapPaginationAdvancedInput(
    pagination: ProfilePaginationAdvancedGatewayInput,
  ): ProfilePaginationAdvancedInput {
    return {
      ...pagination,
      currentActivity: pagination.currentActivity
        ? ACTIVITY_TO_GRPC[pagination.currentActivity]
        : undefined,
    };
  }

  mapActivityPaginationInput(
    pagination: ActivityPaginationGatewayInput,
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
  ): ActivityPaginationGatewayOutput {
    return {
      ...paginaton,
      activityType: paginaton.activityType
        ? GRPC_TO_ACTIVITY[paginaton.activityType]
        : undefined,
    };
  }

  mapActivityListOutput(list: ActivityOutput[]): ActivityGatewayOutput[] {
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
    pagination: ReputationPaginationGatewayInput,
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
  ): ReputationPaginationGatewayOutput {
    return {
      ...pagination,
      action: pagination.action
        ? GRPC_TO_ACTIONS[pagination.action]
        : undefined,
    };
  }

  mapReputationListOutput(list: ReputationOutput[]): ReputationGatewayOutput[] {
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
