import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Roles } from '@org/enums';
import {
  GETMethod,
  GETProtectedMethod,
  HTTPController,
  PUTProtectedMethod,
  QUERYMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators';
import {
  ProfileAdvancedPaginationDto,
  ProfileBasePaginationDto,
  UpdateProfileDto,
} from '@org/gateway-dto';
import { ProfileGatewayMapService } from '@org/gateway-map';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  ProfileServiceObservableContract,
  ValidateInput,
} from '@org/grpc-types';
import type {
  PaginatedProfilesBaseSharedOutput,
  PaginatedProfilesGatewayAdvancedOutput,
  ProfileAdvancedSharedOutput,
  ProfileBaseSharedOutput,
} from '@org/shared-types';

@HTTPController({ microserviceName: 'Profile', serviceName: 'Profile' })
export class ProfileController implements OnModuleInit {
  private profileContract!: ProfileServiceObservableContract;

  constructor(
    @Inject('PROFILE_CLIENT') private readonly client: ClientGrpc,
    private readonly map: ProfileGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.profileContract =
      this.client.getService<ProfileServiceObservableContract>(
        'ProfileService',
      );
  }

  @GETProtectedMethod({
    path: 'me',
    operationDesc: 'Get my profile',
  })
  async getMyProfile(
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<ProfileAdvancedSharedOutput> {
    const response = await firstValueFrom(
      this.profileContract.GetMe({ validation }),
    );
    return this.map.mapProfileAdvancedOutput(response);
  }

  @GETMethod({
    path: ':nickname/base',
    operationDesc: 'Get base profile by nickname',
  })
  async getProfileByNicknameBase(
    @Param('nickname') nickname: string,
  ): Promise<ProfileBaseSharedOutput> {
    const response = await firstValueFrom(
      this.profileContract.GetProfileByNicknameBase({ nickname }),
    );
    return this.map.mapProfileBaseOutput(response);
  }

  @GETProtectedMethod({
    path: ':nickname/advanced',
    operationDesc: 'Get advanced profile by nickname. Moderator and admin only',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getProfileByNicknameAdvanced(
    @ValidateInputParam() validation: ValidateInput,
    @Param('nickname') nickname: string,
  ): Promise<ProfileAdvancedSharedOutput> {
    const response = await firstValueFrom(
      this.profileContract.GetProfileByNicknameAdvanced({
        nickname,
        validation,
      }),
    );
    return this.map.mapProfileAdvancedOutput(response);
  }

  @QUERYMethod({
    path: 'base',
    operationDesc: 'Get paginated profiles list with base pagination',
  })
  async getProfilesBase(
    @Body() dto: ProfileBasePaginationDto,
  ): Promise<PaginatedProfilesBaseSharedOutput> {
    const response = await firstValueFrom(
      this.profileContract.GetProfilesBase({ pagination: dto }),
    );
    return {
      pagination: response.pagination,
      profiles: this.map.mapProfileList(response.profiles),
    };
  }

  @QUERYProtectedMethod({
    path: 'advanced',
    operationDesc:
      'Get paginated profiles list with advanced pagination. Moderator and admin only',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getProfilesAdvanced(
    @Body() dto: ProfileAdvancedPaginationDto,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<PaginatedProfilesGatewayAdvancedOutput> {
    const pagination = this.map.mapPaginationAdvancedInput(dto);
    const response = await firstValueFrom(
      this.profileContract.GetProfilesAdvanced({ pagination, validation }),
    );
    return {
      pagination: this.map.mapPaginationAdvanced(response.pagination),
      profiles: this.map.mapProfileList(response.profiles),
    };
  }

  @PUTProtectedMethod({
    path: 'me',
    operationDesc: 'Update profile data',
  })
  async updateProfileData(
    @ValidateInputParam() validation: ValidateInput,
    @Body() data: UpdateProfileDto,
  ): Promise<ProfileAdvancedSharedOutput> {
    const response = await firstValueFrom(
      this.profileContract.UpdateProfile({ validation, data }),
    );
    return this.map.mapProfileAdvancedOutput(response);
  }
}
