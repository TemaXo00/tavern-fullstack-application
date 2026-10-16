import { Body, Inject, OnModuleInit, Param, Req, Res } from '@nestjs/common';
import { CookieService } from '@org/gateway-authorization';
import {
  GETProtectedMethod,
  HTTPController,
  POSTMethod,
  SessionInputParam,
  ValidateInputParam,
} from '@org/gateway-decorators';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from '@org/gateway-dto';
import { AuthGatewayMapService } from '@org/gateway-map';
import { AUTH_AUTHORIZATION_ROUTES } from '@org/routes-config';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  AuthServiceObservableContract,
  SessionInput,
  ValidateInput,
} from '@org/grpc-types';
import type { AuthSharedOutput, UserSharedEntity } from '@org/shared-types';
import type { Request, Response } from 'express';

@HTTPController({ microserviceName: 'Auth', serviceName: 'Authorization' })
export class AuthController implements OnModuleInit {
  private authContract!: AuthServiceObservableContract;

  constructor(
    @Inject('AUTH_CLIENT') private readonly client: ClientGrpc,
    private readonly cookie: CookieService,
    private readonly map: AuthGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.authContract =
      this.client.getService<AuthServiceObservableContract>('AuthService');
  }

  @POSTMethod({
    path: AUTH_AUTHORIZATION_ROUTES.REGISTER,
    summary: 'Register a new user account',
    operationDesc:
      'Creates a new user, initializes a session, and issues a pair of JWT tokens. The refresh token is stored in an HTTP-only cookie for security. Returns the access token for immediate use.',
  })
  async register(
    @Body() dto: RegisterDto,
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSharedOutput> {
    const response = await firstValueFrom(
      this.authContract.Register({ session, ...dto }),
    );
    this.cookie.setRefreshToken(res, response.refreshToken);
    return { accessToken: response.accessToken };
  }

  @POSTMethod({
    path: AUTH_AUTHORIZATION_ROUTES.LOGIN,
    summary: 'Authenticate an existing user',
    operationDesc:
      'Validates user credentials, creates a new session, and issues a pair of JWT tokens. The refresh token is stored in an HTTP-only cookie. Returns the access token for immediate use.',
  })
  async login(
    @Body() dto: LoginDto,
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSharedOutput> {
    const response = await firstValueFrom(
      this.authContract.Login({ session, ...dto }),
    );
    this.cookie.setRefreshToken(res, response.refreshToken);
    return { accessToken: response.accessToken };
  }

  @POSTMethod({
    path: AUTH_AUTHORIZATION_ROUTES.REFRESH,
    summary: 'Refresh access and refresh tokens',
    operationDesc:
      'Uses the refresh token stored in an HTTP-only cookie to issue a new pair of JWT tokens. The new refresh token overwrites the old cookie. If the refresh token is invalid or expired, the cookie is removed and an error is returned.',
  })
  async refresh(
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<AuthSharedOutput> {
    const refreshToken = this.cookie.getRefreshToken(req);
    try {
      const response = await firstValueFrom(
        this.authContract.Refresh({ refreshToken, session }),
      );
      this.cookie.setRefreshToken(res, response.refreshToken);
      return { accessToken: response.accessToken };
    } catch (err: unknown) {
      this.cookie.removeRefreshToken(res);
      throw err;
    }
  }

  @POSTMethod({
    path: AUTH_AUTHORIZATION_ROUTES.LOGOUT,
    summary: 'Log out from the current session',
    operationDesc:
      'Destroys the current session and invalidates all JWT tokens associated with it. The refresh token cookie is removed from the client.',
  })
  async logout(
    @SessionInputParam() session: SessionInput,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const refreshToken = this.cookie.getRefreshToken(req);
    await firstValueFrom(this.authContract.Logout({ refreshToken, session }));
    this.cookie.removeRefreshToken(res);
  }

  @POSTMethod({
    path: AUTH_AUTHORIZATION_ROUTES.FORGOT_PASSWORD,
    summary: 'Request a password reset link',
    operationDesc:
      'Sends a password reset email to the specified address if a user with that email exists. Always returns a success response to prevent email enumeration attacks.',
  })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await firstValueFrom(this.authContract.ForgotPassword(dto));
  }

  @POSTMethod({
    path: AUTH_AUTHORIZATION_ROUTES.RESET_PASSWORD.PATH,
    summary: 'Reset password using a valid token',
    operationDesc:
      'Sets a new password for the user identified by the reset token. All active sessions of the user are destroyed for security reasons.',
  })
  async resetPassword(
    @Param(AUTH_AUTHORIZATION_ROUTES.RESET_PASSWORD.PARAM) token: string,
    @SessionInputParam() session: SessionInput,
    @Body() dto: ResetPasswordDto,
  ): Promise<void> {
    await firstValueFrom(
      this.authContract.ResetPassword({ token, session, ...dto }),
    );
  }

  @GETProtectedMethod({
    path: 'me',
    summary: 'Get current authenticated user',
    operationDesc:
      'Returns the profile of the currently authenticated user based on the provided access token.',
  })
  async me(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserSharedEntity> {
    return this.map.mapUserEntity(
      await firstValueFrom(this.authContract.GetMe(validation)),
    );
  }
}
