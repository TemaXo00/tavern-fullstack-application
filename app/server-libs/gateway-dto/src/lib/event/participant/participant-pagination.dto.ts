import { ParticipantStatuses } from '@org/enums'
import { EventParticipantPaginationSharedInput } from '@org/shared-types'

import { ParticipantStatusesDecorator } from '../../decorators/event/participant-status.js'
import { BasePaginationDto } from '../../shared/pagination-base.dto.js'

export class PaginatedParticipantsDto extends BasePaginationDto implements EventParticipantPaginationSharedInput {
  @ParticipantStatusesDecorator(false)
  status?: ParticipantStatuses
}
