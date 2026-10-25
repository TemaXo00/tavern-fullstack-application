import { GRPC_TO_EVENT_STATUSES, GRPC_TO_PARTICIPANT_STATUSES } from '@org/enums'
import { EventParticipantWhereInput, EventWhereInput } from '@org/event-database'
import { EventParticipantPaginationGrpcInput, ParticipatedEventsPaginationGrpcInput } from '@org/grpc-types'

export function buildParticipatedEventsQuery(
  userId: string,
  pagination: ParticipatedEventsPaginationGrpcInput,
): EventWhereInput {
  const where: EventWhereInput = {
    participants: {
      some: {
        userId,
      },
    },
  }

  if (pagination.search) {
    where.OR = [
      { name: { contains: pagination.search, mode: 'insensitive' } },
      { description: { contains: pagination.search, mode: 'insensitive' } },
    ]
  }

  if (pagination.status) {
    where.status = GRPC_TO_EVENT_STATUSES[pagination.status]
  }

  return where
}

export function buildEventParticipantsQuery(
  slug: string,
  pagination: EventParticipantPaginationGrpcInput,
): EventParticipantWhereInput {
  const where: EventParticipantWhereInput = {
    event: { slug },
  }

  if (pagination.search) {
    where.note = { contains: pagination.search, mode: 'insensitive' }
  }

  if (pagination.status) {
    where.status = GRPC_TO_PARTICIPANT_STATUSES[pagination.status]
  }

  return where
}
