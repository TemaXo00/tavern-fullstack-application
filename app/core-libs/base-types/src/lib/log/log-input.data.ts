import { PaginationBaseInput } from '../shared/pagination.type.js'

export interface LogPaginationBaseInput extends PaginationBaseInput {
  dateFrom?: Date
  dateTo?: Date
  microserviceName?: string
  serviceName?: string
  isAdminAction?: boolean
}

export interface GetPaginatedLogsBaseInput {
  pagination: LogPaginationBaseInput
}

export interface GetLogsByActorBaseInput {
  actorId: string
  pagination: LogPaginationBaseInput
}
