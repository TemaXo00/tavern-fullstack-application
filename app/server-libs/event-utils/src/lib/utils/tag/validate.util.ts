import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EventTagDetailedOutput } from '@org/grpc-types';
import { EVENT_MESSAGES } from '@org/validation-messages';

import { EventTagDatabaseUtil } from './database.util';

@Injectable()
export class EventTagValidateUtil {
  constructor(private readonly dbUtil: EventTagDatabaseUtil) {}

  async checkTagExisting(slug: string): Promise<EventTagDetailedOutput> {
    const tag = await this.dbUtil.getTagBySlug(slug);
    if (!tag) {
      throw new RpcException({
        message: EVENT_MESSAGES.TAG_NOT_FOUND,
        code: status.NOT_FOUND,
      });
    }
    return tag;
  }

  async checkSlugUnique(slug: string): Promise<void> {
    const tag = await this.dbUtil.getTagBySlug(slug);
    if (tag) {
      throw new RpcException({
        message: EVENT_MESSAGES.TAG_SLUG_EXISTING,
        code: status.ALREADY_EXISTS,
      });
    }
  }
}
