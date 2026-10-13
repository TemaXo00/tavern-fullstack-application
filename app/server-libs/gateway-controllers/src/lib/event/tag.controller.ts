import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Roles } from '@org/enums';
import {
  DELETEProtectedMethod,
  GETMethod,
  HTTPController,
  POSTProtected,
  PUTProtectedMethod,
  QUERYMethod,
  ValidateInputParam,
} from '@org/gateway-decorators';
import {
  CreateEventTagDto,
  EventTagPaginationDto,
  UpdateEventTagDto,
} from '@org/gateway-dto';
import {
  EventTagServiceObservableContract,
  type ValidateInput,
} from '@org/grpc-types';
import { EVENT_TAG_ROUTES } from '@org/routes-config';
import {
  EventTagDetailedSharedOutput,
  EventTagSharedOutput,
  PaginatedEventTagsSharedOutput,
} from '@org/shared-types';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';

@HTTPController({
  microserviceName: 'Event',
  serviceName: 'Tag',
})
export class TagController implements OnModuleInit {
  private tagContract!: EventTagServiceObservableContract;

  constructor(@Inject('EVENT_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.tagContract =
      this.client.getService<EventTagServiceObservableContract>('TagService');
  }

  @QUERYMethod({
    path: EVENT_TAG_ROUTES.GET_PAGINATED,
    operationDesc: 'Get Paginated Tags',
  })
  async getPaginatedTags(
    @Body() pagination: EventTagPaginationDto,
  ): Promise<PaginatedEventTagsSharedOutput> {
    return await firstValueFrom(
      this.tagContract.GetPaginatedTags({ pagination }),
    );
  }

  @GETMethod({
    path: EVENT_TAG_ROUTES.GET_BY_SLUG.PATH,
    operationDesc: 'Get Tag by Slug',
  })
  async getTagBySlug(
    @Param(EVENT_TAG_ROUTES.GET_BY_SLUG.PARAM) slug: string,
  ): Promise<EventTagDetailedSharedOutput> {
    return await firstValueFrom(this.tagContract.GetTagBySlug({ slug }));
  }

  @POSTProtected({
    path: EVENT_TAG_ROUTES.CREATE,
    operationDesc: 'Create new tag',
    roles: [Roles.ADMIN],
  })
  async create(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateEventTagDto,
  ): Promise<EventTagSharedOutput> {
    return await firstValueFrom(
      this.tagContract.CreateTag({ validation, ...dto }),
    );
  }

  @PUTProtectedMethod({
    path: EVENT_TAG_ROUTES.UPDATE.PATH,
    operationDesc: 'Update event tag',
    roles: [Roles.ADMIN],
  })
  async update(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_TAG_ROUTES.UPDATE.PARAM) slug: string,
    @Body() dto: UpdateEventTagDto,
  ): Promise<EventTagSharedOutput> {
    return await firstValueFrom(
      this.tagContract.UpdateTag({
        validation,
        slug,
        ...dto,
      }),
    );
  }

  @DELETEProtectedMethod({
    path: EVENT_TAG_ROUTES.DELETE.PATH,
    operationDesc: 'Delete tag',
    roles: [Roles.ADMIN],
  })
  async delete(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_TAG_ROUTES.DELETE.PARAM) slug: string,
  ): Promise<void> {
    await firstValueFrom(this.tagContract.DeleteTag({ validation, slug }));
  }
}
