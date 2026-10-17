import { GRPC_TO_EVENT_STATUSES } from '@org/enums'
import { EventWhereInput } from '@org/event-database'
import { EventPrivatePaginationGrpcInput, EventPublicPaginationGrpcInput } from '@org/grpc-types'

export function buildPublicQuery(pagination: EventPublicPaginationGrpcInput, userId?: string): EventWhereInput {
  const where: EventWhereInput = {}

  where.status = 'PUBLISHED'

  if (userId) {
    where.organizerId = userId
  }

  if (pagination.search) {
    where.OR = [
      { name: { contains: pagination.search, mode: 'insensitive' } },
      { description: { contains: pagination.search, mode: 'insensitive' } },
    ]
  }

  if (pagination.dateFrom || pagination.dateTo) {
    where.dateAndTime = {}

    if (pagination.dateFrom) {
      where.dateAndTime.gte = new Date(pagination.dateFrom)
    }

    if (pagination.dateTo) {
      where.dateAndTime.lte = new Date(pagination.dateTo)
    }
  }

  if (pagination.leftPlacesFrom !== undefined || pagination.leftPlacesTo !== undefined) {
    where.leftPlaces = {}

    if (pagination.leftPlacesFrom !== undefined) {
      where.leftPlaces.gte = pagination.leftPlacesFrom
    }

    if (pagination.leftPlacesTo !== undefined) {
      where.leftPlaces.lte = pagination.leftPlacesTo
    }
  }

  if (pagination.tags && pagination.tags.length > 0) {
    where.tags = {
      some: { slug: { in: pagination.tags } },
    }
  }

  return where
}

export function buildPrivateQuery(pagination: EventPrivatePaginationGrpcInput, userId?: string): EventWhereInput {
  const where = buildPublicQuery(pagination, userId)

  where.status = undefined

  if (pagination.totalPlacesFrom !== undefined || pagination.totalPlacesTo !== undefined) {
    where.totalPlaces = {}

    if (pagination.totalPlacesFrom !== undefined) {
      where.totalPlaces.gte = pagination.totalPlacesFrom
    }

    if (pagination.totalPlacesTo !== undefined) {
      where.totalPlaces.lte = pagination.totalPlacesTo
    }
  }

  if (pagination.status !== undefined) {
    where.status = GRPC_TO_EVENT_STATUSES[pagination.status]
  }

  return where
}
