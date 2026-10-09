import { ReputationPaginationBaseInput } from '@org/base-types';
import { Actions } from '@org/enums';

import { Replace } from '../../utils/replace.js';

export type ReputationPaginationSharedInput = Replace<
  ReputationPaginationBaseInput,
  {
    action?: Actions;
  }
>;
