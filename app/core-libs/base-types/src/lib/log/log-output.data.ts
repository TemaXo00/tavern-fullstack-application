import { PaginationBaseOutput } from '../shared/pagination.type.js'

export interface LogBaseOutput {
  id: string
  actorId: string | null
  action: string
  actionDesc: string
  microserviceName: string
  serviceName: string
  isAdminAction: boolean
  logBody: string
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
