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
    summary: 'Get paginated tags',
    operationDesc:
      'Returns a paginated list of all event tags. Supports search by name or slug.',
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
    summary: 'Get tag by slug',
    operationDesc:
      'Returns detailed information about a specific tag by its slug.',
  })
  async getTagBySlug(
    @Param(EVENT_TAG_ROUTES.GET_BY_SLUG.PARAM) slug: string,
  ): Promise<EventTagDetailedSharedOutput> {
    return await firstValueFrom(this.tagContract.GetTagBySlug({ slug }));
  }

  @POSTProtected({
    path: EVENT_TAG_ROUTES.CREATE,
    summary: 'Create a new tag',
    operationDesc:
      'Creates a new event tag with a unique name and slug. Available only to administrators.',
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
    summary: 'Update a tag',
    operationDesc:
      'Updates the name, description, or color of the tag. Available only to administrators.',
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
    summary: 'Delete a tag',
    operationDesc:
      'Permanently removes the tag from the system. Events using this tag will lose the association. Available only to administrators.',
    roles: [Roles.ADMIN],
  })
  async delete(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_TAG_ROUTES.DELETE.PARAM) slug: string,
  ): Promise<void> {
    await firstValueFrom(this.tagContract.DeleteTag({ validation, slug }));
  }
}
