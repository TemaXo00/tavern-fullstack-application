import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ActivityFeatureService } from './activity-feature.service';

import type {
  ActivityServiceContract,
  GetActivityByNicknameInput,
  GetMyActivityInput,
  PaginatedActivityOutput,
} from '@org/types';

@Controller()
export class ActivityFeatureController implements ActivityServiceContract {
  constructor(private readonly service: ActivityFeatureService) {}

  @GrpcMethod('ActivityService', 'GetMyLogs')
  async GetMyLogs(data: GetMyActivityInput): Promise<PaginatedActivityOutput> {
    return await this.service.GetMyLogs(data);
  }

  @GrpcMethod('ActivityService', 'GetActivityByNickname')
  async GetActivityByNickname(
    data: GetActivityByNicknameInput,
  ): Promise<PaginatedActivityOutput> {
    return await this.service.GetActivityByNickname(data);
  }
}
