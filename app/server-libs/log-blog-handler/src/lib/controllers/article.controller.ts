import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  BLOG_ARTICLE_MESSAGES,
  type BlogArticleChangeStatusMessage,
  type BlogArticleCreatedMessage,
  type BlogArticleDeleteMessage,
  type BlogArticleUpdateMessage,
} from '@org/rmq-messages'

@Controller()
export class ArticleController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(BLOG_ARTICLE_MESSAGES.ARTICLE_CREATE)
  async handleCreateArticle(@Payload() data: BlogArticleCreatedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'BLOG',
      serviceName: 'Article',
      action: BLOG_ARTICLE_MESSAGES.ARTICLE_CREATE,
      actionDesc: 'Admin created blog article',
      isAdminAction: true,
      logBody: data,
      actorId: data.authorId,
    })
  }

  @EventPattern(BLOG_ARTICLE_MESSAGES.ARTICLE_PUBLISH)
  async handlePublishArticle(@Payload() data: BlogArticleChangeStatusMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'BLOG',
      serviceName: 'Article',
      action: BLOG_ARTICLE_MESSAGES.ARTICLE_PUBLISH,
      actionDesc: 'Admin published blog article',
      isAdminAction: true,
      logBody: data,
      actorId: data.authorId ?? undefined,
    })
  }

  @EventPattern(BLOG_ARTICLE_MESSAGES.ARTICLE_UNPUBLISH)
  async handleUnpublishArticle(@Payload() data: BlogArticleChangeStatusMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'BLOG',
      serviceName: 'Article',
      action: BLOG_ARTICLE_MESSAGES.ARTICLE_UNPUBLISH,
      actionDesc: 'Admin unpublished blog article',
      isAdminAction: true,
      logBody: data,
      actorId: data.authorId ?? undefined,
    })
  }

  @EventPattern(BLOG_ARTICLE_MESSAGES.ARTICLE_UPDATE)
  async handleUpdateArticle(@Payload() data: BlogArticleUpdateMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'BLOG',
      serviceName: 'Article',
      action: BLOG_ARTICLE_MESSAGES.ARTICLE_UPDATE,
      actionDesc: 'Admin updated blog article',
      isAdminAction: true,
      logBody: data,
      actorId: data.authorId ?? undefined,
    })
  }

  @EventPattern(BLOG_ARTICLE_MESSAGES.ARTICLE_DELETE)
  async handleDeleteArticle(@Payload() data: BlogArticleDeleteMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'BLOG',
      serviceName: 'Article',
      action: BLOG_ARTICLE_MESSAGES.ARTICLE_DELETE,
      actionDesc: 'Admin deleted blog article',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }
}
