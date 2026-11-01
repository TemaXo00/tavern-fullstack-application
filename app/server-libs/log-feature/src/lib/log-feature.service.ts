import { Injectable } from '@nestjs/common'
import { AuthValidateService } from '@org/auth-authorization-core'
import { Roles } from '@org/enums'
import { LogDatabaseUtil } from '@org/log-util'

import type {
  GetLogsByActorInput,
  GetPaginatedLogsInput,
  LogServiceContract,
  PaginatedLogsOutput,
} from '@org/grpc-types'

@Injectable()
export class LogFeatureService implements LogServiceContract {
  constructor(
    private readonly dbUtil: LogDatabaseUtil,
    private readonly validate: AuthValidateService,
  ) {}

  async GetLogs(data: GetPaginatedLogsInput): Promise<PaginatedLogsOutput> {
    await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    return await this.dbUtil.getPaginatedLogs(data.pagination)
  }

  async GetLogsByActor(data: GetLogsByActorInput): Promise<PaginatedLogsOutput> {
    await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    return await this.dbUtil.getPaginatedLogs(data.pagination, data.actorId)
  }
}
