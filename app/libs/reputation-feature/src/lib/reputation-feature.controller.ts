import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ReputationFeatureService } from './reputation-feature.service';

import type {
  GetMyReputationInput,
  GetReputationByNicknameInput,
  PaginatedReputationOutput,
  ReputationServiceContract,
} from '@org/types';

@Controller()
export class ReputationFeatureController implements ReputationServiceContract {
  constructor(private readonly service: ReputationFeatureService) {}

  @GrpcMethod('ReputationService', 'GetMyLogs')
  async GetMyLogs(
    data: GetMyReputationInput,
  ): Promise<PaginatedReputationOutput> {
    return await this.service.GetMyLogs(data);
  }

  @GrpcMethod('ReputationService', 'GetReputationByNickname')
  async GetReputationByNickname(
    data: GetReputationByNicknameInput,
  ): Promise<PaginatedReputationOutput> {
    return await this.service.GetReputationByNickname(data);
  }
}
