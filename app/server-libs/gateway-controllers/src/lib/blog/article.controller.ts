import { Body, Inject, OnModuleInit } from '@nestjs/common'
import { HTTPController, QUERYMethod } from '@org/gateway-decorators'
import { BlogArticlePaginationDto } from '@org/gateway-dto'
import { BLOG_ARTICLE_ROUTES } from '@org/routes-config'
import { PaginatedBlogArticlesSharedOutput } from '@org/shared-types'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { BlogArticleServiceObservableContract } from '@org/grpc-types'

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
}
