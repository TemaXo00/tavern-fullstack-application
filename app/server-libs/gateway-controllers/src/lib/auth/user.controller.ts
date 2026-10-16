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
import {
  BlockUserDto,
  ChangeEmailDto,
  ChangePasswordDto,
  DeleteUserDto,
  UserPaginationDto,
} from '@org/gateway-dto';
import { AuthGatewayMapService } from '@org/gateway-map';
import { AUTH_USER_ROUTES } from '@org/routes-config';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  UserServiceObservableContract,
  ValidateInput,
} from '@org/grpc-types';
import type {
  PaginatedUserSharedOutput,
  UserSharedOutput,
} from '@org/shared-types';

@HTTPController({
  microserviceName: 'Auth',
  serviceName: 'User',
})
export class UserController implements OnModuleInit {
  private userContract!: UserServiceObservableContract;

  constructor(
    @Inject('AUTH_CLIENT') private readonly client: ClientGrpc,
    private readonly map: AuthGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.userContract =
      this.client.getService<UserServiceObservableContract>('UserService');
  }

  @QUERYProtectedMethod({
    path: AUTH_USER_ROUTES.GET_PAGINATED,
    summary: 'Get paginated users',
    operationDesc:
      'Returns a paginated list of users. Supports search by email and filtering by role, activity, and blocked status. Available to administrators and moderators.',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getPaginatedUsers(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: UserPaginationDto,
  ): Promise<PaginatedUserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.GetAllUsers({
        validation,
        pagination: this.map.mapUserPaginationRequest(pagination),
      }),
    );
    return {
      pagination: this.map.mapUserPaginationResponse(response.pagination),
      users: this.map.mapAllUsersResponse(response.users),
    };
  }

  @GETProtectedMethod({
    path: AUTH_USER_ROUTES.GET_BY_ID.PATH,
    summary: 'Get user by ID',
    operationDesc:
      'Returns detailed information about a specific user by their ID. Available to administrators and moderators.',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getUserById(
    @ValidateInputParam() validation: ValidateInput,
    @Param(AUTH_USER_ROUTES.GET_BY_ID.PARAM) id: string,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.GetUserById({ validation, id }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: AUTH_USER_ROUTES.CHANGE_EMAIL,
    summary: 'Change current user email',
    operationDesc:
      'Updates the email address of the currently authenticated user. The new email must not be already taken.',
  })
  async changeEmail(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: ChangeEmailDto,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.ChangeEmail({ validation, ...dto }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: AUTH_USER_ROUTES.CHANGE_PASSWORD,
    summary: 'Change current user password',
    operationDesc:
      'Updates the password of the currently authenticated user. Requires the old password for verification.',
  })
  async changePassword(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: ChangePasswordDto,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.ChangePassword({ validation, ...dto }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: AUTH_USER_ROUTES.SET_INACTIVE,
    summary: 'Set my account as inactive',
    operationDesc:
      'Marks the current user account as inactive. The user will not be able to log in until reactivated by an administrator.',
  })
  async setInactive(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<void> {
    await firstValueFrom(this.userContract.SetUserInactive({ validation }));
  }

  @PATCHProtectedMethod({
    path: AUTH_USER_ROUTES.BLOCK.PATH,
    summary: 'Block a user',
    operationDesc:
      'Blocks the specified user. Requires a reason and an optional block expiration date. Available to administrators and moderators.',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async blockUser(
    @Param(AUTH_USER_ROUTES.BLOCK.PARAM) id: string,
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: BlockUserDto,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.BlockUser({
        id,
        validation,
        ...dto,
      }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: AUTH_USER_ROUTES.UNBLOCK.PATH,
    summary: 'Unblock a user',
    operationDesc:
      'Removes the block from the specified user. Available to administrators and moderators.',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async unblockUser(
    @Param(AUTH_USER_ROUTES.UNBLOCK.PARAM) id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.UnblockUser({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: AUTH_USER_ROUTES.PROMOTE.PATH,
    summary: 'Promote a user to moderator',
    operationDesc:
      'Grants the moderator role to the specified user. Available only to administrators.',
    roles: [Roles.ADMIN],
  })
  async promoteUser(
    @Param(AUTH_USER_ROUTES.PROMOTE.PARAM) id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.PromoteToModerator({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: AUTH_USER_ROUTES.DEMOTE.PATH,
    summary: 'Demote a moderator to user',
    operationDesc:
      'Revokes the moderator role from the specified user. Available only to administrators.',
    roles: [Roles.ADMIN],
  })
  async demoteModerator(
    @Param(AUTH_USER_ROUTES.DEMOTE.PARAM) id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.DemoteFromModerator({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: AUTH_USER_ROUTES.ACTIVE.PATH,
    summary: 'Set user as active',
    operationDesc:
      'Marks the specified user account as active. Available only to administrators.',
    roles: [Roles.ADMIN],
  })
  async setActive(
    @ValidateInputParam() validation: ValidateInput,
    @Param(AUTH_USER_ROUTES.ACTIVE.PARAM) id: string,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.ChangeUserToActive({ validation, id }),
    );
    return this.map.mapUserResponse(response);
  }

  @DELETEProtectedMethod({
    path: AUTH_USER_ROUTES.DELETE,
    summary: 'Delete my account',
    operationDesc:
      'Permanently deletes the current user account along with all related data. Requires password confirmation.',
  })
  async deleteUser(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: DeleteUserDto,
  ): Promise<void> {
    await firstValueFrom(
      this.userContract.DeleteUser({ validation, password: dto.password }),
    );
  }
}
