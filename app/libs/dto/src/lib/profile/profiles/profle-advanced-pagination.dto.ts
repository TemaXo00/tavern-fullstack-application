import { ActivityType, ProfilePaginationAdvancedInput } from '@org/types';

import { Activity } from '../../decorators/profile/activity-type.decorator.js';
import { BirthDate } from '../../decorators/profile/birth-date.decorator.js';
import { Reputation } from '../../decorators/profile/reputation.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';
import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

export class ProfileAdvancedPaginationDto
  extends BasePaginationDto
  implements ProfilePaginationAdvancedInput
{
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
