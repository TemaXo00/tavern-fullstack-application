import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  HTTPController,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators';
import { ActivityPaginationDto } from '@org/gateway-dto';
import { ProfileGatewayMapService } from '@org/gateway-map';
import { PaginatedActivitySharedOutput } from '@org/shared-types';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  ActivityServiceObservableContract,
  ValidateInput,
} from '@org/grpc-types';

@HTTPController({
  microserviceName: 'Profile',
  serviceName: 'Activity',
})
export class ActivityController implements OnModuleInit {
  private activityContract!: ActivityServiceObservableContract;

  constructor(
    @Inject('PROFILE_CLIENT') private readonly client: ClientGrpc,
    private readonly map: ProfileGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.activityContract =
      this.client.getService<ActivityServiceObservableContract>(
        'ActivityService',
      );
  }

  @QUERYProtectedMethod({
    path: 'me',
    operationDesc: 'Get activity logs for current user',
  })
  async getMe(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: ActivityPaginationDto,
  ): Promise<PaginatedActivitySharedOutput> {
    const response = await firstValueFrom(
      this.activityContract.GetMyLogs({
        validation,
        pagination: this.map.mapActivityPaginationInput(pagination),
      }),
    );
    return {
      pagination: this.map.mapActivityPaginationOutput(response.pagination),
      activityLogs: this.map.mapActivityListOutput(response.activityLogs),
    };
  }

  @QUERYProtectedMethod({
    path: ':nickname/logs',
    operationDesc:
      'Get other user activity logs. Need admin or moderator roles',
  })
  async getByNickname(
    @ValidateInputParam() validation: ValidateInput,
    @Param('nickname') nickname: string,
    @Body() pagination: ActivityPaginationDto,
  ): Promise<PaginatedActivitySharedOutput> {
    const response = await firstValueFrom(
      this.activityContract.GetActivityByNickname({
        validation,
        nickname,
        pagination: this.map.mapActivityPaginationInput(pagination),
      }),
    );
    return {
      pagination: this.map.mapActivityPaginationOutput(response.pagination),
      activityLogs: this.map.mapActivityListOutput(response.activityLogs),
    };
  }
}
