import { PARTICIPANT_STATUSES_TO_GRPC } from '@org/enums'
import { EventParticipantGetPayload } from '@org/event-database'
import { EventParticipantOutput } from '@org/grpc-types'

import { PARTICIPANT_OUTPUT_SELECTIONS } from '../../helpers/selections'

export function mapParticipantOutput(
  response: EventParticipantGetPayload<{
    select: typeof PARTICIPANT_OUTPUT_SELECTIONS
  }>,
): EventParticipantOutput {
  return {
    nickname: response.user.nickname,
    avatarId: response.user.avatarId,
    eventId: response.eventId,
    isFixed: response.isFixed,
    note: response.note,
    status: PARTICIPANT_STATUSES_TO_GRPC[response.status],
  }
}
