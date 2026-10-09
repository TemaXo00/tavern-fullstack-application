import { TokenState } from '../../decorators/auth/token-state.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

import type { TokenStates } from '@org/enums';
import type { TokenPaginationSharedInput } from '@org/shared-types';

export class TokenPaginationDto
  extends BasePaginationDto
  implements TokenPaginationSharedInput
{
  @TokenState({ required: false })
  state?: TokenStates;
}
