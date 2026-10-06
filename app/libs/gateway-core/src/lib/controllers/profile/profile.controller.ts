import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ProfileAdvancedPaginationDto,
  ProfileBasePaginationDto,
  UpdateProfileDto,
} from '@org/dto';
import {
  PaginatedProfilesGatewayAdvancedOutput,
  PaginatedProfilesGatewayBaseOutput,
  Roles,
  type ProfileGatewayAdvancedOutput,
  type ProfileGatewayBaseOutput,
  type ProfileServiceObservableContract,
  type ValidateInput,
} from '@org/types';
import { firstValueFrom } from 'rxjs';

import { HTTPController } from '../../decorators/controller.decorator';
import {
  GETMethod,
  GETProtectedMethod,
} from '../../decorators/methods/get-method.decorator';
import { PUTProtectedMethod } from '../../decorators/methods/put-method.decorator';
import {
  QUERYMethod,
  QUERYProtectedMethod,
} from '../../decorators/methods/query-method.decorator';
import { ValidateInputParam } from '../../decorators/validate-input.decorator';
import { ProfileGatewayMapService } from '../../services/map/profile-map.service';

import type { ClientGrpc } from '@nestjs/microservices';

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
  ): Promise<ProfileGatewayAdvancedOutput> {
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
  ): Promise<ProfileGatewayBaseOutput> {
    const response = await firstValueFrom(
      this.profileContract.GetProfileByNicknameBase({ nickname }),
    );
    return this.map.mapProfileBaseOutput(response);
  }

  @GETProtectedMethod({
    path: ':nickname/advanced',
    operationDesc: 'Get advanced profile by nickname',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getProfileByNicknameAdvanced(
    @ValidateInputParam() validation: ValidateInput,
    @Param('nickname') nickname: string,
  ): Promise<ProfileGatewayAdvancedOutput> {
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
  ): Promise<PaginatedProfilesGatewayBaseOutput> {
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
    operationDesc: 'Get paginated profiles list with advanced pagination',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getProfilesAdvanced(
    @Body() dto: ProfileAdvancedPaginationDto,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<PaginatedProfilesGatewayAdvancedOutput> {
    const response = await firstValueFrom(
      this.profileContract.GetProfilesAdvanced({ pagination: dto, validation }),
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
  ): Promise<ProfileGatewayAdvancedOutput> {
    const response = await firstValueFrom(
      this.profileContract.UpdateProfile({ validation, data }),
    );
    return this.map.mapProfileAdvancedOutput(response);
  }
}
