import { Activity } from '../../decorators/profile/activity-type.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

import type { ActivityPaginationGatewayInput, ActivityType } from '@org/types';

export class ActivityPaginationDto
  extends BasePaginationDto
  implements ActivityPaginationGatewayInput
{
  @Activity()
  activityType?: ActivityType;
}
