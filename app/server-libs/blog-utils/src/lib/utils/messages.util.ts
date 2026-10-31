import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  BLOG_ARTICLE_MESSAGES,
  BLOG_TAG_MESSAGES,
  BlogArticleCreatedMessage,
  BlogArticleChangeStatusMessage,
  BlogArticleUpdateMessage,
  BlogArticleDeleteMessage,
  BlogTagCreatedMessage,
  BlogTagDeletedMessage,
} from '@org/rmq-messages'

@Injectable()
export class BlogMessagesUtil {
  constructor(@Inject('LOG_CLIENT') private readonly log: ClientProxy) {}

  createTag(data: BlogTagCreatedMessage): void {
    this.log.emit(BLOG_TAG_MESSAGES.TAG_CREATE, data)
  }

  deleteTag(data: BlogTagDeletedMessage): void {
    this.log.emit(BLOG_TAG_MESSAGES.TAG_DELETE, data)
  }

  createArticle(data: BlogArticleCreatedMessage): void {
    this.log.emit(BLOG_ARTICLE_MESSAGES.ARTICLE_CREATE, data)
  }

  publishArticle(data: BlogArticleChangeStatusMessage): void {
    this.log.emit(BLOG_ARTICLE_MESSAGES.ARTICLE_PUBLISH, data)
  }

  unpublishArticle(data: BlogArticleChangeStatusMessage): void {
    this.log.emit(BLOG_ARTICLE_MESSAGES.ARTICLE_UNPUBLISH, data)
  }

  updateArticle(data: BlogArticleUpdateMessage): void {
    this.log.emit(BLOG_ARTICLE_MESSAGES.ARTICLE_UPDATE, data)
  }

  deleteArticle(data: BlogArticleDeleteMessage): void {
    this.log.emit(BLOG_ARTICLE_MESSAGES.ARTICLE_DELETE, data)
  }
}
