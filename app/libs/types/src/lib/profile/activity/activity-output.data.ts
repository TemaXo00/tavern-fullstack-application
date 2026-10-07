import { ActivityType } from '../../enums/profile.enum.js';
import { PaginationBaseOutput } from '../../shared/pagination.type.js';
import { Replace } from '../../utils/replace.js';

export interface ActivityPaginationOutput extends PaginationBaseOutput {
  currentActivity?: number;
}

export interface ActivityOutput {
  status: number;
  createdAt: Date;
}

export interface PaginatedActivityOutput {
  pagination: ActivityPaginationOutput;
  activityLogs: ActivityOutput[];
}

export type ActivityPaginationGatewayOutput = Replace<
  ActivityPaginationOutput,
  {
    currentActivity?: ActivityType;
  }
>;

export type ActivityGatewayOutput = Replace<
  ActivityOutput,
  {
    currentActivity: ActivityType;
  }
>;

export interface PaginatedActivityGatewayOutput {
  pagination: ActivityPaginationGatewayOutput;
  activityLogs: ActivityGatewayOutput[];
}
