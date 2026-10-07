import { Injectable } from '@nestjs/common';
import {
  ACTIVITY_TO_GRPC,
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
}
