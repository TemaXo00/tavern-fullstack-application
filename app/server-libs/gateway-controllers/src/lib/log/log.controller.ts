import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { Roles } from '@org/enums'
import { HTTPController, QUERYProtectedMethod, ValidateInputParam } from '@org/gateway-decorators'
import { LogsPaginationDto } from '@org/gateway-dto'
import { LogGatewayMapService } from '@org/gateway-map'
import { LOG_ROUTES } from '@org/routes-config'
import { PaginatedLogsSharedOutput } from '@org/shared-types'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { LogServiceObservableContract, ValidateInput } from '@org/grpc-types'

@HTTPController({
  microserviceName: 'Log',
  serviceName: 'Logs',
})
export class LogsController implements OnModuleInit {
  private logsContract!: LogServiceObservableContract

  constructor(
    @Inject('LOG_CLIENT') private readonly client: ClientGrpc,
    private readonly map: LogGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.logsContract = this.client.getService('LogService')
  }

  @QUERYProtectedMethod({
    path: LOG_ROUTES.GET_PAGINATED,
    summary: 'Get paginated logs',
    operationDesc:
      'Returns paginated logs. In default, returns info by all users and in all microservices and services. Only admin route',
    roles: [Roles.ADMIN],
  })
  async getAllLogs(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: LogsPaginationDto,
  ): Promise<PaginatedLogsSharedOutput> {
    const response = await firstValueFrom(this.logsContract.GetLogs({ validation, pagination }))
    return {
      pagination: response.pagination,
      logs: this.map.mapLogsOutput(response.logs),
    }
  }

  @QUERYProtectedMethod({
    path: LOG_ROUTES.GET_BY_ACTOR_ID.PATH,
    summary: 'Get paginated logs by actor',
    operationDesc:
      'Returns paginated logs by actor. It shows actions if in log service they marked by his ID. Only admin route',
    roles: [Roles.ADMIN],
  })
  async getLogsByActor(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: LogsPaginationDto,
    @Param(LOG_ROUTES.GET_BY_ACTOR_ID.PARAM) actorId: string,
  ): Promise<PaginatedLogsSharedOutput> {
    const response = await firstValueFrom(this.logsContract.GetLogsByActor({ validation, pagination, actorId }))
    return {
      pagination: response.pagination,
      logs: this.map.mapLogsOutput(response.logs),
    }
  }
}
