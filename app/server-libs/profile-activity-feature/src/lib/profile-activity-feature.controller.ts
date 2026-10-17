import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ProfileActivityFeatureService } from './profile-activity-feature.service';

import type {
  ActivityServiceContract,
  GetActivityByNicknameInput,
  GetMyActivityInput,
  PaginatedActivityOutput,
} from '@org/grpc-types';

@Controller()
export class ProfileActivityFeatureController implements ActivityServiceContract {
  constructor(private readonly service: ProfileActivityFeatureService) {}

  @GrpcMethod('ActivityService', 'GetMyLogs')
  async GetMyLogs(data: GetMyActivityInput): Promise<PaginatedActivityOutput> {
    return await this.service.GetMyLogs(data);
  }

  @GrpcMethod('ActivityService', 'GetActivityByNickname')
  async GetActivityByNickname(data: GetActivityByNicknameInput): Promise<PaginatedActivityOutput> {
    return await this.service.GetActivityByNickname(data);
  }
}
