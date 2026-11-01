import { Injectable } from '@nestjs/common'
import { LogGrpcOutput, PaginatedLogsGrpcInput, PaginatedLogsOutput } from '@org/grpc-types'
import { LogDatabaseService, LogWhereInput } from '@org/log-database'
import { PaginationUtil, StringValidationUtil } from '@org/shared-utils'

interface CreateLog {
  actorId?: string
  action: string
  actionDesc: string
  microserviceName: string
  serviceName: string
  isAdminAction: boolean
  logBody: unknown
}

@Injectable()
export class LogDatabaseUtil {
  constructor(
    private readonly db: LogDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil,
  ) {}

  // GET Methods

  private async getLogs(where: LogWhereInput, skip: number, take: number): Promise<LogGrpcOutput[]> {
    const response = await this.db.log.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        actorId: true,
        action: true,
        actionDesc: true,
        microserviceName: true,
        serviceName: true,
        isAdminAction: true,
        logBody: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: 'desc' }, { serviceName: 'asc' }, { microserviceName: 'asc' }, { id: 'asc' }],
    })
    return response.map((log) => {
      return {
        ...log,
        logBody: JSON.stringify(log.logBody),
      }
    })
  }

  async getPaginatedLogs(pagination: PaginatedLogsGrpcInput, actorId?: string): Promise<PaginatedLogsOutput> {
    if (actorId) {
      this.stringUtil.validateUUIDV7(actorId)
    }

    const safePagination = pagination || {}
    const where = this.buildPaginationQuery(safePagination, actorId)
    const total = await this.db.log.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)

    return {
      pagination: {
        ...params,
        search: safePagination.search,
        dateFrom: safePagination.dateFrom,
        dateTo: safePagination.dateTo,
        isAdminAction: safePagination.isAdminAction,
        microserviceName: safePagination.microserviceName,
        serviceName: safePagination.serviceName,
      },
      logs: await this.getLogs(where, params.skip, params.limit),
    }
  }

  async createLog(data: CreateLog): Promise<void> {
    const logBody = JSON.parse(JSON.stringify(data.logBody ?? {}))

    await this.db.log.create({
      data: {
        ...data,
        logBody,
      },
    })
  }

  buildPaginationQuery(query: PaginatedLogsGrpcInput, actorId?: string): LogWhereInput {
    const where: LogWhereInput = {
      actorId,
    }

    if (query.search) {
      where.OR = [
        { action: { contains: query.search, mode: 'insensitive' } },
        { actionDesc: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    if (query.serviceName) {
      where.serviceName = { contains: query.serviceName, mode: 'insensitive' }
    }

    if (query.microserviceName) {
      where.microserviceName = { contains: query.microserviceName, mode: 'insensitive' }
    }

    if (query.isAdminAction !== undefined) {
      where.isAdminAction = query.isAdminAction
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {}

      if (query.dateFrom) {
        const dateFrom = new Date(query.dateFrom)

        where.createdAt.gte = dateFrom
      }

      if (query.dateTo) {
        const dateTo = new Date(query.dateTo)

        where.createdAt.lte = dateTo
      }
    }

    return where
  }
}
