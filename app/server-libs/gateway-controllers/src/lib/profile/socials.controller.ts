import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import {
  DELETEProtectedMethod,
  GETMethod,
  GETProtectedMethod,
  HTTPController,
  POSTProtected,
  ValidateInputParam,
} from '@org/gateway-decorators'
import { CreateSocialDto } from '@org/gateway-dto'
import { PROFILE_SOCIALS_ROUTES } from '@org/routes-config'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { SocialServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { AllSocialsSharedOutput, SocialSharedOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Profile',
  serviceName: 'Social',
})
export class SocialsController implements OnModuleInit {
  private socialsContract!: SocialServiceObservableContract

  constructor(@Inject('PROFILE_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.socialsContract = this.client.getService('SocialService')
  }

  @GETProtectedMethod({
    path: PROFILE_SOCIALS_ROUTES.GET_ME,
    summary: 'Get my socials',
    operationDesc: 'Returns all socials, created by user. Only current user action',
  })
  async getMe(@ValidateInputParam() validation: ValidateInput): Promise<AllSocialsSharedOutput> {
    return await firstValueFrom(this.socialsContract.GetMySocials({ validation }))
  }

  @GETMethod({
    path: PROFILE_SOCIALS_ROUTES.GET_BY_NICKNAME.PATH,
    summary: 'Get other user socials',
    operationDesc: 'Returns other user socials by his nickname. Public route',
  })
  async getOther(
    @Param(PROFILE_SOCIALS_ROUTES.GET_BY_NICKNAME.PARAM) nickname: string,
  ): Promise<AllSocialsSharedOutput> {
    return await firstValueFrom(this.socialsContract.GetSocialsByNickname({ nickname }))
  }

  @POSTProtected({
    path: PROFILE_SOCIALS_ROUTES.CREATE,
    summary: 'Create social',
    operationDesc: 'Creating new social link. Max available socials written in .env file. By default, its 5',
  })
  async create(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateSocialDto,
  ): Promise<SocialSharedOutput> {
    return await firstValueFrom(this.socialsContract.CreateSocial({ validation, ...dto }))
  }

  @DELETEProtectedMethod({
    path: PROFILE_SOCIALS_ROUTES.DELETE.PATH,
    summary: 'Delete social',
    operationDesc: 'Deletes social by its ID. Current user method',
  })
  async deleteSocial(
    @Param(PROFILE_SOCIALS_ROUTES.DELETE.PARAM) socialId: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<void> {
    await firstValueFrom(this.socialsContract.DeleteSocial({ socialId, validation }))
  }
}
