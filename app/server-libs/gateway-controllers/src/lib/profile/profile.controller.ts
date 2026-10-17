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
import { ProfileAdvancedPaginationDto, ProfileBasePaginationDto, UpdateProfileDto } from '@org/gateway-dto';
import { ProfileGatewayMapService } from '@org/gateway-map';
import { PROFILE_PROFILE_ROUTES } from '@org/routes-config';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type { ProfileServiceObservableContract, ValidateInput } from '@org/grpc-types';
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
    this.profileContract = this.client.getService<ProfileServiceObservableContract>('ProfileService');
  }

  @GETProtectedMethod({
    path: PROFILE_PROFILE_ROUTES.GET_ME,
    summary: 'Get my profile',
    operationDesc: 'Returns the full profile of the currently authenticated user, including private fields.',
  })
  async getMyProfile(@ValidateInputParam() validation: ValidateInput): Promise<ProfileAdvancedSharedOutput> {
    const response = await firstValueFrom(this.profileContract.GetMe({ validation }));
    return this.map.mapProfileAdvancedOutput(response);
  }

  @GETMethod({
    path: PROFILE_PROFILE_ROUTES.GET_BY_NICKNAME_BASE.PATH,
    summary: 'Get base profile by nickname',
    operationDesc: 'Returns the public (base) profile of the specified user. Available to everyone.',
  })
  async getProfileByNicknameBase(
    @Param(PROFILE_PROFILE_ROUTES.GET_BY_NICKNAME_BASE.PARAM) nickname: string,
  ): Promise<ProfileBaseSharedOutput> {
    const response = await firstValueFrom(this.profileContract.GetProfileByNicknameBase({ nickname }));
    return this.map.mapProfileBaseOutput(response);
  }

  @GETProtectedMethod({
    path: PROFILE_PROFILE_ROUTES.GET_BY_NICKNAME_ADVANCED.PATH,
    summary: 'Get advanced profile by nickname',
    operationDesc:
      'Returns the full profile of the specified user, including private fields. Available only to administrators and moderators.',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getProfileByNicknameAdvanced(
    @ValidateInputParam() validation: ValidateInput,
    @Param(PROFILE_PROFILE_ROUTES.GET_BY_NICKNAME_ADVANCED.PARAM)
    nickname: string,
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
    path: PROFILE_PROFILE_ROUTES.GET_PROFILES_BASE,
    summary: 'Get paginated base profiles',
    operationDesc: 'Returns a paginated list of public (base) profiles. Supports search by nickname.',
  })
  async getProfilesBase(@Body() dto: ProfileBasePaginationDto): Promise<PaginatedProfilesBaseSharedOutput> {
    const response = await firstValueFrom(this.profileContract.GetProfilesBase({ pagination: dto }));
    return {
      pagination: response.pagination,
      profiles: this.map.mapProfileList(response.profiles),
    };
  }

  @QUERYProtectedMethod({
    path: PROFILE_PROFILE_ROUTES.GET_PROFILES_ADVANCED,
    summary: 'Get paginated advanced profiles',
    operationDesc:
      'Returns a paginated list of full profiles with advanced filters such as email, birth date, reputation, and activity. Available only to administrators and moderators.',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async getProfilesAdvanced(
    @Body() dto: ProfileAdvancedPaginationDto,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<PaginatedProfilesGatewayAdvancedOutput> {
    const pagination = this.map.mapPaginationAdvancedInput(dto);
    const response = await firstValueFrom(this.profileContract.GetProfilesAdvanced({ pagination, validation }));
    return {
      pagination: this.map.mapPaginationAdvanced(response.pagination),
      profiles: this.map.mapProfileList(response.profiles),
    };
  }

  @PUTProtectedMethod({
    path: PROFILE_PROFILE_ROUTES.UPDATE_ME,
    summary: 'Update my profile',
    operationDesc:
      'Updates the profile data of the currently authenticated user: nickname, name, surname, description, birth date, or avatar.',
  })
  async updateProfileData(
    @ValidateInputParam() validation: ValidateInput,
    @Body() data: UpdateProfileDto,
  ): Promise<ProfileAdvancedSharedOutput> {
    const response = await firstValueFrom(this.profileContract.UpdateProfile({ validation, data }));
    return this.map.mapProfileAdvancedOutput(response);
  }
}
