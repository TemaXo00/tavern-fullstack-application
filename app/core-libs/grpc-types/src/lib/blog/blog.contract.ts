import type { Empty } from '../shared/empty.type.js'
import type { ToObservable } from '../utils/to-observable.js'
import type {
  CreateBlogArticleInput,
  DeleteBlogArticleInput,
  GetBlogArticleBySlugInput,
  GetMyBlogArticleBySlugInput,
  GetMyPaginatedBlogArticles,
  GetPaginatedBlogArticlesInput,
  PublishBlogArticleInput,
  UnpublishBlogArticleInput,
  UpdateBlogArticleInput,
} from './article/article-input.data.js'
import type { BlogArticleBySlugOutput, PaginatedBlogArticlesOutput } from './article/article-output.data.js'
import type {
  BlogTagPaginationInput,
  CreateBlogTagInput,
  DeleteBlogTagInput,
  GetBlogTagInput,
} from './tag/tag-input.data.js'
import type { BlogTagDetailedOutput, BlogTagOutput, PaginatedBlogTagsOutput } from './tag/tag-output.data.js'

export interface BlogTagServiceContract {
  GetPaginatedTags(data: BlogTagPaginationInput): Promise<PaginatedBlogTagsOutput>
  GetTagBySlug(data: GetBlogTagInput): Promise<BlogTagDetailedOutput>
  CreateTag(data: CreateBlogTagInput): Promise<BlogTagOutput>
  DeleteTag(data: DeleteBlogTagInput): Promise<Empty>
}

export interface BlogArticleServiceContract {
  GetArticles(data: GetPaginatedBlogArticlesInput): Promise<PaginatedBlogArticlesOutput>
  GetMyArticles(data: GetMyPaginatedBlogArticles): Promise<PaginatedBlogArticlesOutput>
  GetArticleBySlug(data: GetBlogArticleBySlugInput): Promise<BlogArticleBySlugOutput>
  GetMyArticleBySlug(data: GetMyBlogArticleBySlugInput): Promise<BlogArticleBySlugOutput>
  CreateArticle(data: CreateBlogArticleInput): Promise<BlogArticleBySlugOutput>
  PublishArticle(data: PublishBlogArticleInput): Promise<BlogArticleBySlugOutput>
  UnpublishArticle(data: UnpublishBlogArticleInput): Promise<BlogArticleBySlugOutput>
  UpdateArticle(data: UpdateBlogArticleInput): Promise<BlogArticleBySlugOutput>
  DeleteArticle(data: DeleteBlogArticleInput): Promise<Empty>
}

export type BlogTagServiceObservableContract = ToObservable<BlogTagServiceContract>
export type BlogArticleServiceObservableContract = ToObservable<BlogArticleServiceContract>
