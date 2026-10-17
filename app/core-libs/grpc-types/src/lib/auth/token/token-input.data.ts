import { GetTokensBaseInput, TokenByIdBaseInput, TokenPaginationBaseInput } from '@org/base-types';

import { Protected } from '../../utils/protected.js';

export type TokenPaginationInput = TokenPaginationBaseInput;
export type GetTokensInput = Protected<GetTokensBaseInput>;
export type TokenByIdInput = Protected<TokenByIdBaseInput>;
export type RevokeTokenInput = Protected<TokenByIdBaseInput>;
export type DeleteTokenInput = Protected<TokenByIdBaseInput>;
export type DeleteAllNotActiveTokensInput = Protected<null>;
