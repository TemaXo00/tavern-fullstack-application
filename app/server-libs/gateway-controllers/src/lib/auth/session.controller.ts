import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Roles } from '@org/enums';
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators';
import { LocalNameDto } from '@org/gateway-dto';
import { AUTH_SESSION_ROUTES } from '@org/routes-config';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  SessionServiceObservableContract,
  ValidateInput,
} from '@org/grpc-types';
import type { AllSessionsOutput, SessionOutput } from '@org/shared-types';

@HTTPController({ serviceName: 'Session', microserviceName: 'Auth' })
export class SessionController implements OnModuleInit {
  private sessionContract!: SessionServiceObservableContract;

  constructor(@Inject('AUTH_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.sessionContract =
      this.client.getService<SessionServiceObservableContract>(
        'SessionService',
      );
  }

  @GETProtectedMethod({
    path: AUTH_SESSION_ROUTES.GET_BY_USER.PATH,
    operationDesc: 'Admin method to check user sessions',
    roles: [Roles.ADMIN],
  })
  async getSessionsByUser(
    @ValidateInputParam() validation: ValidateInput,
    @Param(AUTH_SESSION_ROUTES.GET_BY_USER.PARAM) userId: string,
  ): Promise<AllSessionsOutput> {
    return await firstValueFrom(
      this.sessionContract.GetSessionsByUser({ validation, userId }),
    );
  }

  @GETProtectedMethod({
    path: AUTH_SESSION_ROUTES.GET_MY_SESSIONS,
    operationDesc: 'Get all sessions by current user',
  })
  async getMySessions(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<AllSessionsOutput> {
    return await firstValueFrom(
      this.sessionContract.GetMySessions({ validation }),
    );
  }

  @PATCHProtectedMethod({
    path: AUTH_SESSION_ROUTES.CHANGE_LOCAL_NAME,
    operationDesc: 'Updating current user session local name',
  })
  async updateLocalName(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: LocalNameDto,
  ): Promise<SessionOutput> {
    return await firstValueFrom(
      this.sessionContract.ChangeSessionLocalName({
        validation,
        localName: dto.localName,
      }),
    );
  }

  @DELETEProtectedMethod({
    path: AUTH_SESSION_ROUTES.DELETE_SESSION_BY_ID.PATH,
    operationDesc: 'Delete session by id',
  })
  async deleteSessionById(
    @ValidateInputParam() validation: ValidateInput,
    @Param(AUTH_SESSION_ROUTES.DELETE_SESSION_BY_ID.PARAM) sessionId: string,
  ): Promise<SessionOutput> {
    return await firstValueFrom(
      this.sessionContract.DeleteSessionById({ validation, sessionId }),
    );
  }

  @DELETEProtectedMethod({
    path: 'me/session',
    operationDesc: 'Delete all sessions from current user, exclude current',
    noContent: true,
  })
  async deleteAllSessions(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<void> {
    await firstValueFrom(
      this.sessionContract.DeleteAllSessions({ validation }),
    );
  }
}
