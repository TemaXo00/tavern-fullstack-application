import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { LogFeatureService } from './log-feature.service'

import type {
  GetLogsByActorInput,
  GetPaginatedLogsInput,
  LogServiceContract,
  PaginatedLogsOutput,
} from '@org/grpc-types'

@Controller()
export class LogFeatureController implements LogServiceContract {
  constructor(private readonly service: LogFeatureService) {}

  @GrpcMethod('LogService', 'GetLogs')
  async GetLogs(data: GetPaginatedLogsInput): Promise<PaginatedLogsOutput> {
    return await this.service.GetLogs(data)
  }

  @GrpcMethod('LogService', 'GetLogsByActor')
  async GetLogsByActor(data: GetLogsByActorInput): Promise<PaginatedLogsOutput> {
    return await this.service.GetLogsByActor(data)
  }
}
