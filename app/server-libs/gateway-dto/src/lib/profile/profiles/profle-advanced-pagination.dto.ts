import { Activity } from '../../decorators/profile/activity-type.decorator.js';
import { BirthDate } from '../../decorators/profile/birth-date.decorator.js';
import { Reputation } from '../../decorators/profile/reputation.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

import type { ActivityType } from '@org/enums';
import type { ProfilePaginationAdvancedSharedInput } from '@org/shared-types';

export class ProfileAdvancedPaginationDto extends BasePaginationDto implements ProfilePaginationAdvancedSharedInput {
  @Email(false)
  email?: string;

  @BirthDate(false)
  birthDateFrom?: Date;

  @BirthDate(false)
  birthDateTo?: Date;

  @Reputation(false)
  reputationFrom?: number;

  @Reputation(false)
  reputationTo?: number;

  @Activity()
  currentActivity?: ActivityType;
}
