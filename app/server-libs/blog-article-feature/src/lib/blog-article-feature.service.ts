import { Injectable } from '@nestjs/common'

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

@Injectable()
export class BlogArticleFeatureService implements BlogArticleServiceContract {
  async GetArticles(_data: GetPaginatedBlogArticlesInput): Promise<PaginatedBlogArticlesOutput> {
    throw new Error('Method not implemented.')
  }

  async GetArticleBySlug(_data: GetBlogArticleBySlugInput): Promise<BlogArticleBySlugOutput> {
    throw new Error('Method not implemented.')
  }

  async CreateArticle(_data: CreateBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    throw new Error('Method not implemented.')
  }

  async PublishArticle(_data: PublishBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    throw new Error('Method not implemented.')
  }

  async UnpublishArticle(_data: UnpublishBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    throw new Error('Method not implemented.')
  }

  async UpdateArticle(_data: UpdateBlogArticleInput): Promise<BlogArticleBySlugOutput> {
    throw new Error('Method not implemented.')
  }

  async DeleteArticle(_data: DeleteBlogArticleInput): Promise<Empty> {
    throw new Error('Method not implemented.')
  }
}
