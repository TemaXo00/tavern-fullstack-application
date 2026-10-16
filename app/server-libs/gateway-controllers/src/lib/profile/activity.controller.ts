import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Roles } from '@org/enums';
import {
  HTTPController,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators';
import { ActivityPaginationDto } from '@org/gateway-dto';
import { ProfileGatewayMapService } from '@org/gateway-map';
import { PROFILE_ACTIVITY_ROUTES } from '@org/routes-config';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  ActivityServiceObservableContract,
  ValidateInput,
} from '@org/grpc-types';
import type { PaginatedActivitySharedOutput } from '@org/shared-types';

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
    path: PROFILE_ACTIVITY_ROUTES.GET_ME,
    summary: 'Get my activity logs',
    operationDesc:
      'Returns a paginated list of activity logs for the currently authenticated user. Supports filtering by activity type and search query.',
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
    path: PROFILE_ACTIVITY_ROUTES.GET_BY_NICKNAME.PATH,
    summary: 'Get activity logs of a user',
    operationDesc:
      'Returns a paginated list of activity logs for the specified user. Available only to administrators and moderators.',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getByNickname(
    @ValidateInputParam() validation: ValidateInput,
    @Param(PROFILE_ACTIVITY_ROUTES.GET_BY_NICKNAME.PARAM) nickname: string,
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
