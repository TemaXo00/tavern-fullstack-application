import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Roles } from '@org/enums';
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators';
import { TokenPaginationDto } from '@org/gateway-dto';
import { AuthGatewayMapService } from '@org/gateway-map';
import { AUTH_TOKEN_ROUTES } from '@org/routes-config';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  TokenServiceObservableContract,
  ValidateInput,
} from '@org/grpc-types';
import type {
  AllTokensSharedOutput,
  TokenSharedOutput,
} from '@org/shared-types';

@HTTPController({
  microserviceName: 'Auth',
  serviceName: 'Token',
})
export class TokenController implements OnModuleInit {
  private tokenContract!: TokenServiceObservableContract;

  constructor(
    @Inject('AUTH_CLIENT') private readonly client: ClientGrpc,
    private readonly map: AuthGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.tokenContract =
      this.client.getService<TokenServiceObservableContract>('TokenService');
  }

  @QUERYProtectedMethod({
    path: AUTH_TOKEN_ROUTES.GET_WITH_PAGINATION,
    operationDesc: 'Get all tokens with pagination',
    roles: [Roles.ADMIN],
  })
  async getTokensWithPagination(
    @Body() pagination: TokenPaginationDto,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<AllTokensSharedOutput> {
    const response = await firstValueFrom(
      this.tokenContract.GetTokensWithPagination({
        validation,
        pagination: this.map.mapTokenPaginationRequest(pagination),
      }),
    );

    return {
      pagination: this.map.mapTokenPaginationResponse(response.pagination),
      tokens: this.map.mapAllTokensResponse(response.tokens),
    };
  }

  @GETProtectedMethod({
    path: AUTH_TOKEN_ROUTES.GET_BY_ID.PATH,
    operationDesc: 'Returns token by ID. Only admin method',
    roles: [Roles.ADMIN],
  })
  async getTokenById(
    @ValidateInputParam() validation: ValidateInput,
    @Param(AUTH_TOKEN_ROUTES.GET_BY_ID.PARAM) id: string,
  ): Promise<TokenSharedOutput> {
    const response = await firstValueFrom(
      this.tokenContract.GetTokenById({ id, validation }),
    );
    return this.map.mapTokenResponse(response);
  }

  @PATCHProtectedMethod({
    path: AUTH_TOKEN_ROUTES.REVOKE.PATH,
    operationDesc: 'Returns revoked token by ID. Only admin method',
    roles: [Roles.ADMIN],
  })
  async revokeToken(
    @ValidateInputParam() validation: ValidateInput,
    @Param(AUTH_TOKEN_ROUTES.REVOKE.PARAM) id: string,
  ): Promise<TokenSharedOutput> {
    const response = await firstValueFrom(
      this.tokenContract.SetTokenRevoked({ id, validation }),
    );
    return this.map.mapTokenResponse(response);
  }

  @DELETEProtectedMethod({
    path: AUTH_TOKEN_ROUTES.REMOVE.PATH,
    operationDesc: 'Remove token by ID. Only admin method',
    roles: [Roles.ADMIN],
  })
  async deleteTokensById(
    @ValidateInputParam() validation: ValidateInput,
    @Param(AUTH_TOKEN_ROUTES.REMOVE.PARAM) id: string,
  ): Promise<TokenSharedOutput> {
    const response = await firstValueFrom(
      this.tokenContract.DeleteTokenById({ id, validation }),
    );
    return this.map.mapTokenResponse(response);
  }

  @DELETEProtectedMethod({
    path: AUTH_TOKEN_ROUTES.REMOVE_INACTIVE,
    operationDesc: 'Remove all inactive tokens. Only admin method',
    roles: [Roles.ADMIN],
  })
  async deleteAllTokens(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<void> {
    await firstValueFrom(
      this.tokenContract.DeleteAllNotActiveTokens({ validation }),
    );
  }
}
