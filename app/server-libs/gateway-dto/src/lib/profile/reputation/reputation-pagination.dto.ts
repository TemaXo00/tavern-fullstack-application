import { Action } from '../../decorators/profile/action.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

import type { Actions } from '@org/enums';
import type { ReputationPaginationSharedInput } from '@org/shared-types';

export class ReputationPaginationDto extends BasePaginationDto implements ReputationPaginationSharedInput {
  @Action()
  action?: Actions;
}
