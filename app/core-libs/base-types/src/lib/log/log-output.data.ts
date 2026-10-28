import { PaginationBaseOutput } from '../shared/pagination.type.js'

export interface LogBaseOutput {
  id: string
  actorId: string | null
  actionDesc: string
  microserviceName: string
  serviceName: string
  isAdminAction: boolean
  logBody: object
  createdAt: Date
}

export interface LogPaginationBaseOutput extends PaginationBaseOutput {
  dateFrom?: Date
  dateTo?: Date
  microserviceName?: string
  serviceName?: string
  isAdminAction?: boolean
}

export interface PaginatedLogsBaseOutput {
  pagination: LogPaginationBaseOutput
  logs: LogBaseOutput[]
}
