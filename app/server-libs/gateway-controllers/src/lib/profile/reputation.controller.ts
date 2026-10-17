import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { HTTPController, QUERYMethod, QUERYProtectedMethod, ValidateInputParam } from '@org/gateway-decorators'
import { ReputationPaginationDto } from '@org/gateway-dto'
import { ProfileGatewayMapService } from '@org/gateway-map'
import { PROFILE_REPUTATION_ROUTES } from '@org/routes-config'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { ReputationServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { PaginatedReputationSharedOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Profile',
  serviceName: 'Reputation',
})
export class ReputationController implements OnModuleInit {
  private reputationContract!: ReputationServiceObservableContract

  constructor(
    @Inject('PROFILE_CLIENT') private readonly client: ClientGrpc,
    private readonly map: ProfileGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.reputationContract = this.client.getService<ReputationServiceObservableContract>('ReputationService')
  }

  @QUERYProtectedMethod({
    path: PROFILE_REPUTATION_ROUTES.GET_ME,
    summary: 'Get my reputation logs',
    operationDesc:
      'Returns a paginated list of reputation change logs for the currently authenticated user. Supports filtering by action and search query.',
  })
  async getMe(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: ReputationPaginationDto,
  ): Promise<PaginatedReputationSharedOutput> {
    const response = await firstValueFrom(
      this.reputationContract.GetMyLogs({
        validation,
        pagination: this.map.mapReputationPaginationInput(pagination),
      }),
    )
    return {
      pagination: this.map.mapReputationPaginationOutput(response.pagination),
      reputationLogs: this.map.mapReputationListOutput(response.reputationLogs),
    }
  }

  @QUERYMethod({
    path: PROFILE_REPUTATION_ROUTES.GET_BY_NICKNAME.PATH,
    summary: 'Get reputation logs of a user',
    operationDesc: 'Returns a paginated list of reputation change logs for the specified user. Available to everyone.',
  })
  async getByNickname(
    @Param(PROFILE_REPUTATION_ROUTES.GET_BY_NICKNAME.PARAM) nickname: string,
    @Body() pagination: ReputationPaginationDto,
  ): Promise<PaginatedReputationSharedOutput> {
    const response = await firstValueFrom(
      this.reputationContract.GetReputationByNickname({
        nickname,
        pagination: this.map.mapReputationPaginationInput(pagination),
      }),
    )
    return {
      pagination: this.map.mapReputationPaginationOutput(response.pagination),
      reputationLogs: this.map.mapReputationListOutput(response.reputationLogs),
    }
  }
}
