import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ProfileReputationFeatureService } from './profile-reputation-feature.service';

import type {
  GetMyReputationInput,
  GetReputationByNicknameInput,
  PaginatedReputationOutput,
  ReputationServiceContract,
} from '@org/grpc-types';

@Controller()
export class ProfileReputationFeatureController implements ReputationServiceContract {
  constructor(private readonly service: ProfileReputationFeatureService) {}

  @GrpcMethod('ReputationService', 'GetMyLogs')
  async GetMyLogs(data: GetMyReputationInput): Promise<PaginatedReputationOutput> {
    return await this.service.GetMyLogs(data);
  }

  @GrpcMethod('ReputationService', 'GetReputationByNickname')
  async GetReputationByNickname(data: GetReputationByNicknameInput): Promise<PaginatedReputationOutput> {
    return await this.service.GetReputationByNickname(data);
  }
}
