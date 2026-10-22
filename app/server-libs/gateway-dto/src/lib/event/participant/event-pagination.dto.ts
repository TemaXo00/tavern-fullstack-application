import { EventStatuses } from '@org/enums'

import { EventStatusesDecorator } from '../../decorators/event/event-statuses.decorator.js'
import { BasePaginationDto } from '../../shared/pagination-base.dto.js'

import type { ParticipatedEventsPaginationSharedInput } from '@org/shared-types'

export class ParticipatedEventsDto extends BasePaginationDto implements ParticipatedEventsPaginationSharedInput {
  @EventStatusesDecorator()
  status?: EventStatuses
}
