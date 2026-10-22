import { ParticipantStatuses } from '@org/enums'
import { ChangeUserParticipantStatusSharedInput } from '@org/shared-types'

import { ParticipantStatusesDecorator } from '../../decorators/event/participant-status.js'
import { Nickname } from '../../decorators/shared/nickname.decorator.js'

export class ChangeParticipantStatusDto implements ChangeUserParticipantStatusSharedInput {
  @Nickname()
  nickname: string
  @ParticipantStatusesDecorator()
  status: ParticipantStatuses
}
