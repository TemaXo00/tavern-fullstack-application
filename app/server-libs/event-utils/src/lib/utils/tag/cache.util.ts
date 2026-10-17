import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { EventTagDetailedOutput } from '@org/grpc-types';
import Redis from 'ioredis';

@Injectable()
export class EventTagCacheUtil {
  private TTL: number;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    protected readonly config: ConfigService,
  ) {
    this.TTL = config.get<number>('TAVERN_EVENT_TAG_CACHE_TTL', 300);
  }

  async set(tag: EventTagDetailedOutput): Promise<void> {
    await this.redis.set(`event-tag:${tag.slug}`, JSON.stringify(tag), 'EX', this.TTL);
  }

  async get(slug: string): Promise<EventTagDetailedOutput | null> {
    const tag = await this.redis.get(`event-tag:${slug}`);
    if (!tag) {
      return null;
    }
    return JSON.parse(tag);
  }

  async del(slug: string): Promise<void> {
    await this.redis.del(`event-tag:${slug}`);
  }
}
