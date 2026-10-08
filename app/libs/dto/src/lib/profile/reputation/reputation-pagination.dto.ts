import { Action } from '../../decorators/profile/action.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

import type { Actions, ReputationPaginationGatewayInput } from '@org/types';

export class ReputationPaginationDto
  extends BasePaginationDto
  implements ReputationPaginationGatewayInput
{
  @Action()
  action?: Actions;
}
