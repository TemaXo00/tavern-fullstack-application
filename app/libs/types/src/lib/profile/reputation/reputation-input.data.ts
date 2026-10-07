import { Actions } from '../../enums/profile.enum.js';
import { PaginationBaseInput } from '../../shared/pagination.type.js';
import { Protected } from '../../utils/protected.js';
import { Replace } from '../../utils/replace.js';

export interface ReputationPaginationInput extends PaginationBaseInput {
  action?: number;
}

export type ReputationPaginationGatewayInput = Replace<
  ReputationPaginationInput,
  {
    action?: Actions;
  }
>;

export type GetMyReputationInput = Protected<{
  pagination: ReputationPaginationInput;
}>;

export interface GetReputationByNicknameInput {
  nickname: string;
  pagination: ReputationPaginationInput;
}
