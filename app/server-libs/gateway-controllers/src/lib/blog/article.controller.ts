import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { Roles } from '@org/enums'
import {
  DELETEProtectedMethod,
  GETMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  POSTProtected,
  PUTProtectedMethod,
  QUERYMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import { BlogArticlePaginationDto, CreateBlogArticleDto, UpdateBlogArticleDto } from '@org/gateway-dto'
import { BLOG_ARTICLE_ROUTES } from '@org/routes-config'
import { BlogArticleBySlugSharedOutput, PaginatedBlogArticlesSharedOutput } from '@org/shared-types'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { BlogArticleServiceObservableContract, ValidateInput } from '@org/grpc-types'

@HTTPController({
  microserviceName: 'Blog',
  serviceName: 'Article',
})
export class ArticleController implements OnModuleInit {
  private articleContract!: BlogArticleServiceObservableContract

  constructor(@Inject('BLOG_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.articleContract = this.client.getService('ArticleService')
  }

  @QUERYMethod({
    path: BLOG_ARTICLE_ROUTES.GET_PAGINATED_ARTICLES,
    summary: 'Get paginated articles',
    operationDesc: 'Returns paginated articles with all possible pagination methods. Public route',
  })
  async getArticles(@Body() pagination: BlogArticlePaginationDto): Promise<PaginatedBlogArticlesSharedOutput> {
    return await firstValueFrom(this.articleContract.GetArticles({ pagination }))
  }

  @QUERYProtectedMethod({
    path: BLOG_ARTICLE_ROUTES.GET_MY_PAGINATION_ARTICLES,
    summary: 'Get paginated my articles',
    operationDesc: 'Returns paginated articles by current user. Only admin method. Returns all types of articles',
    roles: [Roles.ADMIN],
  })
  async getMyArticles(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: BlogArticlePaginationDto,
  ): Promise<PaginatedBlogArticlesSharedOutput> {
    return await firstValueFrom(this.articleContract.GetMyArticles({ validation, pagination }))
  }

  @GETMethod({
    path: BLOG_ARTICLE_ROUTES.GET_ARTICLE_BY_SLUG.PATH,
    summary: 'Get article by slug',
    operationDesc: 'Returns article by slug. If not exists - return 404 error',
  })
  async getArticleBySlug(
    @Param(BLOG_ARTICLE_ROUTES.GET_ARTICLE_BY_SLUG.PARAM) slug: string,
  ): Promise<BlogArticleBySlugSharedOutput> {
    return await firstValueFrom(this.articleContract.GetArticleBySlug({ slug }))
  }

  @GETProtectedMethod({
    path: BLOG_ARTICLE_ROUTES.GET_MY_ARTICLE_BY_SLUG.PATH,
    summary: 'Get my article by slug',
    operationDesc:
      'Returns article by slug. If not exists - return 404 error. Only owner can check unpublished articles. Admin method',
    roles: [Roles.ADMIN],
  })
  async getMyArticleBySlug(
    @ValidateInputParam() validation: ValidateInput,
    @Param(BLOG_ARTICLE_ROUTES.GET_MY_ARTICLE_BY_SLUG.PARAM) slug: string,
  ): Promise<BlogArticleBySlugSharedOutput> {
    return await firstValueFrom(this.articleContract.GetMyArticleBySlug({ validation, slug }))
  }

  @POSTProtected({
    path: BLOG_ARTICLE_ROUTES.CREATE,
    summary: 'Create new article',
    operationDesc:
      'Logic: if anonim is true - article automatically creates with public state and it can be only deleted. In other case, it unpublished and only current user can manipulate it. Only admin route',
    roles: [Roles.ADMIN],
  })
  async create(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateBlogArticleDto,
  ): Promise<BlogArticleBySlugSharedOutput> {
    return await firstValueFrom(this.articleContract.CreateArticle({ validation, ...dto }))
  }

  @PATCHProtectedMethod({
    path: BLOG_ARTICLE_ROUTES.PUBLISH.PATH,
    summary: 'Publish article',
    operationDesc:
      'If you owner of article and you admin - you can publish it. In other case, you cannot manipulate with it.',
    roles: [Roles.ADMIN],
  })
  async publishArticle(
    @ValidateInputParam() validation: ValidateInput,
    @Param(BLOG_ARTICLE_ROUTES.PUBLISH.PARAM) slug: string,
  ): Promise<BlogArticleBySlugSharedOutput> {
    return await firstValueFrom(this.articleContract.PublishArticle({ validation, slug }))
  }

  @PATCHProtectedMethod({
    path: BLOG_ARTICLE_ROUTES.UNPUBLISH.PATH,
    summary: 'Unublish article',
    operationDesc:
      'If you owner of article and you admin - you can unpublish it. In other case, you cannot manipulate with it.',
    roles: [Roles.ADMIN],
  })
  async unpublishArticle(
    @ValidateInputParam() validation: ValidateInput,
    @Param(BLOG_ARTICLE_ROUTES.UNPUBLISH.PARAM) slug: string,
  ): Promise<BlogArticleBySlugSharedOutput> {
    return await firstValueFrom(this.articleContract.UnpublishArticle({ validation, slug }))
  }

  @PUTProtectedMethod({
    path: BLOG_ARTICLE_ROUTES.UPDATE.PATH,
    summary: 'Update article data',
    operationDesc:
      'Only owner with admin permissions can update all data of its article. If it ones updates, article will be marked by status isUpdated',
    roles: [Roles.ADMIN],
  })
  async updateArticle(
    @ValidateInputParam() validation: ValidateInput,
    @Param(BLOG_ARTICLE_ROUTES.UPDATE.PARAM) slug: string,
    @Body() dto: UpdateBlogArticleDto,
  ): Promise<BlogArticleBySlugSharedOutput> {
    return await firstValueFrom(this.articleContract.UpdateArticle({ validation, slug, ...dto }))
  }

  @DELETEProtectedMethod({
    path: BLOG_ARTICLE_ROUTES.DELETE.PATH,
    summary: 'Delete article',
    operationDesc:
      'Only admin route. Only admin can delete other articles by their slug. You can delete only published articles',
    roles: [Roles.ADMIN]
  })
  async deleteArticle(
    @ValidateInputParam() validation: ValidateInput,
    @Param(BLOG_ARTICLE_ROUTES.DELETE.PARAM) slug: string,
  ): Promise<void> {
    await firstValueFrom(this.articleContract.DeleteArticle({ validation, slug }))
  }
}
