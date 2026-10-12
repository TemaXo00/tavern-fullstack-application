import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { TagFeatureService } from './event-tag-feature.service';

import type {
  CreateEventTagInput,
  DeleteEventTagInput,
  EventTagDetailedOutput,
  EventTagOutput,
  EventTagServiceContract,
  GetEventTagInput,
  GetPaginatedEventTagsInput,
  PaginatedEventTagsOutput,
  UpdateEventTagInput,
} from '@org/grpc-types';

@Controller()
export class TagFeatureController implements EventTagServiceContract {
  constructor(private readonly service: TagFeatureService) {}

  @GrpcMethod('TagService', 'GetPaginatedTags')
  async GetPaginatedTags(
    data: GetPaginatedEventTagsInput,
  ): Promise<PaginatedEventTagsOutput> {
    return await this.service.GetPaginatedTags(data);
  }

  @GrpcMethod('TagService', 'GetTagBySlug')
  async GetTagBySlug(data: GetEventTagInput): Promise<EventTagDetailedOutput> {
    return await this.service.GetTagBySlug(data);
  }

  @GrpcMethod('TagService', 'CreateTag')
  async CreateTag(data: CreateEventTagInput): Promise<EventTagOutput> {
    return await this.service.CreateTag(data);
  }

  @GrpcMethod('TagService', 'UpdateTag')
  async UpdateTag(data: UpdateEventTagInput): Promise<EventTagOutput> {
    return await this.service.UpdateTag(data);
  }

  @GrpcMethod('TagService', 'DeleteTag')
  async DeleteTag(data: DeleteEventTagInput): Promise<void> {
    await this.service.DeleteTag(data);
  }
}
