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
    path: '',
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
    path: ':slug',
    operationDesc: 'Get Tag by Slug',
  })
  async getTagBySlug(
    @Param('slug') slug: string,
  ): Promise<EventTagDetailedSharedOutput> {
    return await firstValueFrom(this.tagContract.GetTagBySlug({ slug }));
  }

  @POSTProtected({
    path: '',
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
    path: ':slug',
    operationDesc: 'Update event tag',
    roles: [Roles.ADMIN],
  })
  async update(
    @ValidateInputParam() validation: ValidateInput,
    @Param('slug') slug: string,
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
    path: ':slug',
    operationDesc: 'Delete tag',
    roles: [Roles.ADMIN],
  })
  async delete(
    @ValidateInputParam() validation: ValidateInput,
    @Param('slug') slug: string,
  ): Promise<void> {
    await firstValueFrom(this.tagContract.DeleteTag({ validation, slug }));
  }
}
