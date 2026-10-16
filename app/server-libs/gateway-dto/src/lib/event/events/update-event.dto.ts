import { UpdateEventDataSharedInput } from '@org/shared-types';

import { EventDate } from '../../decorators/event/event-date.decorator.js';
import { EventPlaces } from '../../decorators/event/event-places.decorator.js';
import { Description } from '../../decorators/shared/description.decorator.js';

export class UpdateEventDto implements UpdateEventDataSharedInput {
  @Description()
  description?: string;
  @EventDate(false)
  dateAndTime?: Date;
  @EventPlaces(false)
  totalPlaces?: number;
}
