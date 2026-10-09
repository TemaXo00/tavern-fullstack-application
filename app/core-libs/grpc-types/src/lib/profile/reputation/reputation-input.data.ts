import {
  GetMyReputationBaseInput,
  GetReputationByNicknameBaseInput,
  ReputationPaginationBaseInput,
} from '@org/base-types';

import { Protected } from '../../utils/protected.js';

export type ReputationPaginationInput = ReputationPaginationBaseInput;
export type GetMyReputationInput = Protected<GetMyReputationBaseInput>;
export type GetReputationByNicknameInput = GetReputationByNicknameBaseInput;
