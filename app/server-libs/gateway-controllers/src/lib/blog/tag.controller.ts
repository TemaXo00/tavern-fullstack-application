import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { Roles } from '@org/enums'
import {
  DELETEProtectedMethod,
  GETMethod,
  HTTPController,
  POSTProtected,
  QUERYMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import { BlogTagPaginationDto, CreateBlogTagDto } from '@org/gateway-dto'
import { BLOG_TAGS_ROUTES } from '@org/routes-config'
import { BlogTagDetailedSharedOutput, BlogTagSharedOutput, PaginatedBlogTagsSharedOutput } from '@org/shared-types'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { BlogTagServiceObservableContract, ValidateInput } from '@org/grpc-types'

@HTTPController({
  microserviceName: 'Blog',
  serviceName: 'Tag',
})
export class TagController implements OnModuleInit {
  private tagContract!: BlogTagServiceObservableContract

  constructor(@Inject('BLOG_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.tagContract = this.client.getService('TagService')
  }

  @QUERYMethod({
    path: BLOG_TAGS_ROUTES.GET_PAGINATED_TAGS,
    summary: 'Get paginated tags',
    operationDesc: 'Returns paginated tags for blog. Public route. Pagination is base',
  })
  async getPaginatedTags(@Body() pagination: BlogTagPaginationDto): Promise<PaginatedBlogTagsSharedOutput> {
    return await firstValueFrom(this.tagContract.GetPaginatedTags({ pagination }))
  }

  @GETMethod({
    path: BLOG_TAGS_ROUTES.GET_TAG_BY_SLUG.PATH,
    summary: 'Get tag by slug',
    operationDesc: 'Returns tag by slug. If it not exists, returns 404 error',
  })
  async getTagBySlug(
    @Param(BLOG_TAGS_ROUTES.GET_TAG_BY_SLUG.PARAM) slug: string,
  ): Promise<BlogTagDetailedSharedOutput> {
    return await firstValueFrom(this.tagContract.GetTagBySlug({ slug }))
  }

  @POSTProtected({
    path: BLOG_TAGS_ROUTES.CREATE,
    summary: 'Create new tag',
    operationDesc:
      'Creating of blog tag. Input - only name. If tag with same slug existing - returns 409 error. Only admin method',
    roles: [Roles.ADMIN],
  })
  async createTag(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateBlogTagDto,
  ): Promise<BlogTagSharedOutput> {
    return await firstValueFrom(this.tagContract.CreateTag({ validation, name: dto.name }))
  }

  @DELETEProtectedMethod({
    path: BLOG_TAGS_ROUTES.DELETE.PATH,
    summary: 'Delete tag by slug',
    operationDesc:
      'Deletes tag by it slug. If article with tag existing - this just disappear from article. Only admin method',
    roles: [Roles.ADMIN],
  })
  async deleteTag(
    @Param(BLOG_TAGS_ROUTES.DELETE.PARAM) slug: string,
    @ValidateInputParam() validation: ValidateInput,
  ): Promise<void> {
    await firstValueFrom(this.tagContract.DeleteTag({ slug, validation }))
  }
}
