import { PaginationBaseOutput } from '../../shared/pagination.type.js';

export interface ActivityPaginationBaseOutput extends PaginationBaseOutput {
  activityType?: number;
}

export interface ActivityBaseOutput {
  status: number;
  createdAt: Date;
}

export interface PaginatedActivityBaseOutput {
  pagination: ActivityPaginationBaseOutput;
  activityLogs: ActivityBaseOutput[];
}
