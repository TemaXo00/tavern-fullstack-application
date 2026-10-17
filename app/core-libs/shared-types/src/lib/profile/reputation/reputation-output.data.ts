import { ReputationBaseOutput, ReputationPaginationBaseOutput } from '@org/base-types';
import { Actions } from '@org/enums';

import { Replace } from '../../utils/replace.js';

export type ReputationPaginationSharedOutput = Replace<
  ReputationPaginationBaseOutput,
  {
    action?: Actions;
  }
>;

export type ReputationSharedOutput = Replace<
  ReputationBaseOutput,
  {
    action: Actions;
  }
>;

export interface PaginatedReputationSharedOutput {
  pagination: ReputationPaginationSharedOutput;
  reputationLogs: ReputationSharedOutput[];
}
