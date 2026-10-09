import {
  GetTokensBaseInput,
  TokenByIdBaseInput,
  TokenPaginationBaseInput,
} from '@org/base-types';
import { TokenStates } from '@org/enums';

import { Replace } from '../../utils/replace.js';

export type TokenPaginationSharedInput = Replace<
  TokenPaginationBaseInput,
  { state?: TokenStates }
>;
export type GetTokensSharedInput = GetTokensBaseInput;
export type TokenByIdInput = TokenByIdBaseInput;
export type RevokeTokenInput = TokenByIdBaseInput;
export type DeleteTokenInput = TokenByIdBaseInput;
