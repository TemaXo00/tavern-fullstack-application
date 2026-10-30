import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { BlogArticleFeatureService } from './blog-article-feature.service'

import type {
  BlogArticleBySlugOutput,
  BlogArticleServiceContract,
  CreateBlogArticleInput,
  DeleteBlogArticleInput,
  Empty,
  GetBlogArticleBySlugInput,
  GetPaginatedBlogArticlesInput,
  PaginatedBlogArticlesOutput,
  PublishBlogArticleInput,
  UnpublishBlogArticleInput,
  UpdateBlogArticleInput,
} from '@org/grpc-types'

@Controller()
export class BlogArticleFeatureController implements BlogArticleServiceContract {
  constructor(private readonly service: BlogArticleFeatureService) {}

  @GrpcMethod('ArticleService', 'GetArticles')
  async GetArticles(data: GetPaginatedBlogArticlesInput): Promise<PaginatedBlogArticlesOutput> {
    return await this.service.GetArticles(data)
  }

  @GrpcMethod('ArticleService', 'GetArticleBySlug')
  async GetArticleBySlug(data: GetBlogArticleBySlugInput): Promise<BlogArticleBySlugOutput> {
    return await this.service.GetArticleBySlug(data)
  }

  @GrpcMethod('ArticleService', 'GetArticleBySlug')
  async CreateArticle(data: CreateBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    return await this.service.CreateArticle(data)
  }

  @GrpcMethod('ArticleService', 'PublishArticle')
  async PublishArticle(data: PublishBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    return await this.service.PublishArticle(data)
  }

  @GrpcMethod('ArticleService', 'UnpublishArticle')
  async UnpublishArticle(data: UnpublishBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    return await this.service.UnpublishArticle(data)
  }

  @GrpcMethod('ArticleService', 'UpdateArticle')
  async UpdateArticle(data: UpdateBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    return await this.service.UpdateArticle(data)
  }

  @GrpcMethod('ArticleService', 'DeleteArticle')
  async DeleteArticle(data: DeleteBlogArticleInput): Promise<Empty> {
    return await this.service.DeleteArticle(data)
  }
}
