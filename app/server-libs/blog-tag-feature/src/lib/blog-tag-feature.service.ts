import { Injectable } from '@nestjs/common'
import { AuthValidateService } from '@org/auth-authorization-core'
import { BlogDatabaseUtil, BlogMessagesUtil, BlogValidationUtil } from '@org/blog-utils'
import { Roles } from '@org/enums'
import { SlugUtil } from '@org/shared-utils'

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
  constructor(
    private readonly dbUtil: BlogDatabaseUtil,
    private readonly validationUtil: BlogValidationUtil,
    private readonly messagesUtil: BlogMessagesUtil,
    private readonly validate: AuthValidateService,
    private readonly slug: SlugUtil,
  ) {}

  async GetPaginatedTags(data: BlogTagPaginationInput): Promise<PaginatedBlogTagsOutput> {
    return await this.dbUtil.getPaginatedTags(data.pagination)
  }

  async GetTagBySlug(data: GetBlogTagInput): Promise<BlogTagDetailedOutput> {
    return await this.validationUtil.checkTagExisting(data.slug)
  }

  async CreateTag(data: CreateBlogTagInput): Promise<BlogTagOutput> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    const slug = this.slug.createSlug(data.name)
    await this.validationUtil.checkTagSlugUnique(slug)
    const response = await this.dbUtil.createTag(data, slug)
    this.messagesUtil.createTag({ adminId: payload.id, tagSlug: slug })
    return response
  }

  async DeleteTag(data: DeleteBlogTagInput): Promise<Empty> {
    const payload = await this.validate.validateWithRoles(data.validation, [Roles.ADMIN])
    await this.validationUtil.checkTagExisting(data.slug)
    await this.dbUtil.deleteTag(data.slug)
    this.messagesUtil.deleteTag({ adminId: payload.id, tagSlug: data.slug })
    return {}
  }
}
