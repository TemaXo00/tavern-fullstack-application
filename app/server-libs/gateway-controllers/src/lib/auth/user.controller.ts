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
    path: '',
    operationDesc: 'Returns paginated users. Search using email of users',
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
    path: ':id',
    operationDesc: 'Get User by ID',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getUserById(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.GetUserById({ validation, id }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: 'me/email',
    operationDesc: 'Change email',
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
    path: 'me/password',
    operationDesc: 'Change password',
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
    path: 'me/inactive',
    operationDesc: 'Set user inactive',
  })
  async setInactive(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<void> {
    await firstValueFrom(this.userContract.SetUserInactive({ validation }));
  }

  @PATCHProtectedMethod({
    path: ':id/block',
    operationDesc: 'Block user by ID. Need to setup blocked until and reason',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async blockUser(
    @Param('id') id: string,
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
    path: ':id/unblock',
    operationDesc: 'Unblock user',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async unblockUser(
    @Param('id') id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.UnblockUser({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: ':id/promote',
    operationDesc: 'Promote user to moderator',
    roles: [Roles.ADMIN],
  })
  async promoteUser(
    @Param('id') id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.PromoteToModerator({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: ':id/demote',
    operationDesc: 'Demote moderator to user',
    roles: [Roles.ADMIN],
  })
  async demoteModerator(
    @Param('id') id: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.DemoteFromModerator({ id, validation }),
    );
    return this.map.mapUserResponse(response);
  }

  @PATCHProtectedMethod({
    path: ':id/active',
    operationDesc: 'Admin set user as active',
    roles: [Roles.ADMIN],
  })
  async setActive(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<UserSharedOutput> {
    const response = await firstValueFrom(
      this.userContract.ChangeUserToActive({ validation, id }),
    );
    return this.map.mapUserResponse(response);
  }

  @DELETEProtectedMethod({
    path: 'me/delete',
    operationDesc: 'Delete current user with all relations',
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
