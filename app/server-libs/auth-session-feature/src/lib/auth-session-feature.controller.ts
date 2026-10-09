import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthSessionFeatureService } from './auth-session-feature.service';

import type {
  AllMySessionsInput,
  AllSessionsByUserInput,
  AllSessionsOutput,
  DeleteAllSessionsInput,
  DeleteSessionByIdInput,
  Empty,
  SessionLocalNameInput,
  SessionOutput,
  SessionServiceContract,
} from '@org/grpc-types';

@Controller()
export class AuthSessionFeatureController implements SessionServiceContract {
  constructor(private readonly service: AuthSessionFeatureService) {}

  @GrpcMethod('SessionService', 'GetSessionsByUser')
  async GetSessionsByUser(
    data: AllSessionsByUserInput,
  ): Promise<AllSessionsOutput> {
    return await this.service.GetSessionsByUser(data);
  }

  @GrpcMethod('SessionService', 'GetMySessions')
  async GetMySessions(data: AllMySessionsInput): Promise<AllSessionsOutput> {
    return await this.service.GetMySessions(data);
  }

  @GrpcMethod('SessionService', 'ChangeSessionLocalName')
  async ChangeSessionLocalName(
    data: SessionLocalNameInput,
  ): Promise<SessionOutput> {
    return await this.service.ChangeSessionLocalName(data);
  }

  @GrpcMethod('SessionService', 'DeleteSessionById')
  async DeleteSessionById(
    data: DeleteSessionByIdInput,
  ): Promise<SessionOutput> {
    return await this.service.DeleteSessionById(data);
  }

  @GrpcMethod('SessionService', 'DeleteAllSessions')
  async DeleteAllSessions(data: DeleteAllSessionsInput): Promise<Empty> {
    return await this.service.DeleteAllSessions(data);
  }
}
