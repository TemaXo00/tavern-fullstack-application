import { Activity } from '../../decorators/profile/activity-type.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

import type { ActivityType } from '@org/enums';
import type { ActivityPaginationSharedInput } from '@org/shared-types';

export class ActivityPaginationDto extends BasePaginationDto implements ActivityPaginationSharedInput {
  @Activity()
  activityType?: ActivityType;
}
