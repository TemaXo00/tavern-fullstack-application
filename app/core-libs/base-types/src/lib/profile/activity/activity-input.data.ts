import { PaginationBaseInput } from '../../shared/pagination.type.js';

export interface ActivityPaginationBaseInput extends PaginationBaseInput {
  activityType?: number;
}

export interface GetActivityByNicknameBaseInput {
  nickname: string;
  pagination: ActivityPaginationBaseInput;
}
