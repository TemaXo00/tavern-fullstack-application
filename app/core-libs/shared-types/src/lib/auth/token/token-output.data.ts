import { TokenBaseOutput, TokenPaginationBaseOutput } from '@org/base-types';
import { TokenStates } from '@org/enums';

import { Replace } from '../../utils/replace.js';

export type TokenPaginationSharedOutput = Replace<
  TokenPaginationBaseOutput,
  { state?: TokenStates }
>;

export type TokenSharedOutput = Replace<
  TokenBaseOutput,
  { state: TokenStates }
>;

export type AllTokensSharedOutput = {
  pagination: TokenPaginationSharedOutput;
  tokens: TokenSharedOutput[];
};
