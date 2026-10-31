import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { BLOG_TAG_MESSAGES, BlogTagCreatedMessage, BlogTagDeletedMessage } from '@org/rmq-messages'

@Injectable()
export class BlogMessagesUtil {
  constructor(@Inject('LOG_CLIENT') private readonly log: ClientProxy) {}

  createTag(data: BlogTagCreatedMessage): void {
    this.log.emit(BLOG_TAG_MESSAGES.TAG_CREATE, data)
  }

  deleteTag(data: BlogTagDeletedMessage): void {
    this.log.emit(BLOG_TAG_MESSAGES.TAG_DELETE, data)
  }
}
