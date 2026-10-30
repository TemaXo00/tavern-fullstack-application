import { Injectable } from '@nestjs/common'

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

@Injectable()
export class BlogTagFeatureService implements BlogTagServiceContract {
  async GetPaginatedTags(_data: BlogTagPaginationInput): Promise<PaginatedBlogTagsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetTagBySlug(_data: GetBlogTagInput): Promise<BlogTagDetailedOutput> {
    throw new Error('Method not implemented.')
  }

  async CreateTag(_data: CreateBlogTagInput): Promise<BlogTagOutput> {
    throw new Error('Method not implemented.')
  }

  async DeleteTag(_data: DeleteBlogTagInput): Promise<Empty> {
    throw new Error('Method not implemented.')
  }
}
