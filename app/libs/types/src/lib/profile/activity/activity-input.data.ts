import { ActivityType } from '../../enums/profile.enum.js';
import { PaginationBaseInput } from '../../shared/pagination.type.js';
import { Protected } from '../../utils/protected.js';
import { Replace } from '../../utils/replace.js';

export interface ActivityPaginationInput extends PaginationBaseInput {
  activityType?: number;
}

export type ActivityPaginationGatewayInput = Replace<
  ActivityPaginationInput,
  {
    activityType?: ActivityType;
  }
>;

export type GetMyActivityInput = Protected<{
  pagination: ActivityPaginationInput;
}>;

export interface GetActivityByNicknameBaseInput {
  nickname: string;
  pagination: ActivityPaginationInput;
}

export type GetActivityByNicknameInput =
  Protected<GetActivityByNicknameBaseInput>;
