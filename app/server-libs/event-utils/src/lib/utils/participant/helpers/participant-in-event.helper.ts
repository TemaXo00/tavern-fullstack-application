import { EventStatuses, ParticipantStatuses } from '@org/enums'
import { EventParticipantGetPayload } from '@org/event-database'

import { PARTICIPANT_IN_EVENT_SELECTIONS } from '../../helpers/selections'

export interface ParticipantInEvent {
  userId: string
  eventId: string
  isFixed: boolean
  organizerId: string
  participantStatus: ParticipantStatuses
  eventStatus: EventStatuses
}

export function mapParticipantInEvent(
  response: EventParticipantGetPayload<{
    select: typeof PARTICIPANT_IN_EVENT_SELECTIONS
  }>,
): ParticipantInEvent {
  return {
    userId: response.userId,
    eventId: response.eventId,
    organizerId: response.event.organizerId,
    isFixed: response.isFixed,
    participantStatus: response.status as ParticipantStatuses,
    eventStatus: response.event.status as EventStatuses,
  }
}
