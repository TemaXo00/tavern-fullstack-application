import { EventStatuses } from '@org/enums';
import { EventPrivatePaginationSharedInput } from '@org/shared-types';

import { EventPublicPaginationDto } from './event-public-pagination.dto.js';
import { EventPlaces } from '../../decorators/event/event-places.decorator.js';
import { EventStatusesDecorator } from '../../decorators/event/event-statuses.decorator.js';

export class EventPrivatePaginationDto
  extends EventPublicPaginationDto
  implements EventPrivatePaginationSharedInput
{
  @EventPlaces(false)
  totalPlacesFrom?: number;

  @EventPlaces(false)
  totalPlacesTo?: number;

  @EventStatusesDecorator()
  status?: EventStatuses;
}
