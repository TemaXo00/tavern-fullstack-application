import type {
  EventPrivatePaginationGrpcInput,
  EventPrivatePaginationGrpcOutput,
  EventPublicPaginationGrpcInput,
  EventPublicPaginationGrpcOutput,
} from '@org/grpc-types'

interface PaginationParams {
  total: number
  page: number
  totalPages: number
  skip: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export function buildPublicPaginationOutput(
  params: PaginationParams,
  pagination: EventPublicPaginationGrpcInput,
): EventPublicPaginationGrpcOutput {
  return {
    ...params,
    search: pagination.search,
    dateFrom: pagination.dateFrom,
    dateTo: pagination.dateTo,
    leftPlacesFrom: pagination.leftPlacesFrom,
    leftPlacesTo: pagination.leftPlacesTo,
    tags: pagination.tags,
  }
}

export function buildPrivatePaginationOutput(
  params: PaginationParams,
  pagination: EventPrivatePaginationGrpcInput,
): EventPrivatePaginationGrpcOutput {
  return {
    ...params,
    search: pagination.search,
    dateFrom: pagination.dateFrom,
    dateTo: pagination.dateTo,
    leftPlacesFrom: pagination.leftPlacesFrom,
    leftPlacesTo: pagination.leftPlacesTo,
    totalPlacesFrom: pagination.totalPlacesFrom,
    totalPlacesTo: pagination.totalPlacesTo,
    status: pagination.status,
    tags: pagination.tags,
  }
}
