import { EventPublicPaginationSharedInput } from '@org/shared-types'

import { EventDate } from '../../decorators/event/event-date.decorator.js'
import { EventPlaces } from '../../decorators/event/event-places.decorator.js'
import { EventTags } from '../../decorators/event/event-tags.decorator.js'
import { BasePaginationDto } from '../../shared/pagination-base.dto.js'

export class EventPublicPaginationDto extends BasePaginationDto implements EventPublicPaginationSharedInput {
  @EventDate(false)
  dateFrom?: Date

  @EventDate(false)
  dateTo?: Date

  @EventPlaces(false)
  leftPlacesFrom?: number

  @EventPlaces(false)
  leftPlacesTo?: number

  @EventTags(false)
  tags?: string[]
}
