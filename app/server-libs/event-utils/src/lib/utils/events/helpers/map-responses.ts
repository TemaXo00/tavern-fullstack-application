import { EVENT_STATUSES_TO_GRPC } from '@org/enums'

import { EVENT_METHODS_SELECTIONS, EVENT_OUTPUT_SELECTIONS } from '../../helpers/selections'

import type { EventGetPayload } from '@org/event-database'
import type { EventMethodsOutput, EventOutput, EventUserShortGrpcOutput } from '@org/grpc-types'

export function mapEventOutputResponse(
  response: EventGetPayload<{
    select: typeof EVENT_OUTPUT_SELECTIONS
  }>,
): EventOutput {
  const users: EventUserShortGrpcOutput[] = response.participants.map((p) => p.user)
  return {
    ...response,
    status: EVENT_STATUSES_TO_GRPC[response.status],
    participants: users,
  }
}

export function mapEventMethodsResponse(
  response: EventGetPayload<{ select: typeof EVENT_METHODS_SELECTIONS }>,
): EventMethodsOutput {
  return {
    ...response,
    status: EVENT_STATUSES_TO_GRPC[response.status],
  }
}
