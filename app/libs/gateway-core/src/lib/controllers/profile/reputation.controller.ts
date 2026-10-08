import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ReputationPaginationDto } from '@org/dto';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import {
  QUERYMethod,
  QUERYProtectedMethod,
} from '../../decorators/methods/query-method.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';
import { ProfileGatewayMapService } from '../../services/map/profile-map.service';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  PaginatedReputationGatewayOutput,
  ReputationServiceObservableContract,
  ValidateInput,
} from '@org/types';

@HTTPController({
  microserviceName: 'Profile',
  serviceName: 'Reputation',
})
export class ReputationController implements OnModuleInit {
  private reputationContract!: ReputationServiceObservableContract;

  constructor(
    @Inject('PROFILE_CLIENT') private readonly client: ClientGrpc,
    private readonly map: ProfileGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.reputationContract =
      this.client.getService<ReputationServiceObservableContract>(
        'ReputationService',
      );
  }

  @QUERYProtectedMethod({
    path: 'me',
    operationDesc: 'Get reputation logs for current user',
  })
  async getMe(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: ReputationPaginationDto,
  ): Promise<PaginatedReputationGatewayOutput> {
    const response = await firstValueFrom(
      this.reputationContract.GetMyLogs({
        validation,
        pagination: this.map.mapReputationPaginationInput(pagination),
      }),
    );
    return {
      pagination: this.map.mapReputationPaginationOutput(response.pagination),
      reputationLogs: this.map.mapReputationListOutput(response.reputationLogs),
    };
  }

  @QUERYMethod({
    path: ':nickname/logs',
    operationDesc: 'Get other user reputation logs',
  })
  async getByNickname(
    @Param('nickname') nickname: string,
    @Body() pagination: ReputationPaginationDto,
  ): Promise<PaginatedReputationGatewayOutput> {
    const response = await firstValueFrom(
      this.reputationContract.GetReputationByNickname({
        nickname,
        pagination: this.map.mapReputationPaginationInput(pagination),
      }),
    );
    return {
      pagination: this.map.mapReputationPaginationOutput(response.pagination),
      reputationLogs: this.map.mapReputationListOutput(response.reputationLogs),
    };
  }
}
