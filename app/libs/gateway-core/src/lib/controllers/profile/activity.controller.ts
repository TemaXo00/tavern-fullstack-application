import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ActivityPaginationDto } from '@org/dto';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import { QUERYProtectedMethod } from '../../decorators/methods/query-method.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';
import { ProfileGatewayMapService } from '../../services/map/profile-map.service';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  ActivityServiceObservableContract,
  PaginatedActivityGatewayOutput,
  ValidateInput,
} from '@org/types';

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
  ): Promise<PaginatedActivityGatewayOutput> {
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
  ): Promise<PaginatedActivityGatewayOutput> {
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
