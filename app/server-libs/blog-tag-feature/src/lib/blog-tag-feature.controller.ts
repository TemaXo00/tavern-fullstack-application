import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { BlogTagFeatureService } from './blog-tag-feature.service'

import type {
  BlogTagDetailedOutput,
  BlogTagOutput,
  BlogTagPaginationInput,
  BlogTagServiceContract,
  CreateBlogTagInput,
  DeleteBlogTagInput,
  Empty,
  GetBlogTagInput,
  PaginatedBlogTagsOutput,
} from '@org/grpc-types'

@Controller()
export class BlogTagFeatureController implements BlogTagServiceContract {
  constructor(private readonly service: BlogTagFeatureService) {}

  @GrpcMethod('TagService', 'GetPaginatedTags')
  async GetPaginatedTags(data: BlogTagPaginationInput): Promise<PaginatedBlogTagsOutput> {
    return await this.service.GetPaginatedTags(data)
  }

  @GrpcMethod('TagService', 'GetTagBySlug')
  async GetTagBySlug(data: GetBlogTagInput): Promise<BlogTagDetailedOutput> {
    return await this.service.GetTagBySlug(data)
  }

  @GrpcMethod('TagService', 'CreateTag')
  async CreateTag(data: CreateBlogTagInput): Promise<BlogTagOutput> {
    return await this.service.CreateTag(data)
  }

  @GrpcMethod('TagService', 'DeleteTag')
  async DeleteTag(data: DeleteBlogTagInput): Promise<Empty> {
    return await this.service.DeleteTag(data)
  }
}
