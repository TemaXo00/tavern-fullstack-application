import { Injectable } from '@nestjs/common'

import type {
  GetLogsByActorInput,
  GetPaginatedLogsInput,
  LogServiceContract,
  PaginatedLogsOutput,
} from '@org/grpc-types'

@Injectable()
export class LogFeatureService implements LogServiceContract {
  async GetLogs(_data: GetPaginatedLogsInput): Promise<PaginatedLogsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetLogsByActor(_data: GetLogsByActorInput): Promise<PaginatedLogsOutput> {
    throw new Error('Method not implemented.')
  }
}
