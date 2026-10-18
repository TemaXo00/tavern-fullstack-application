import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

import type { EventOutput, PaginatedPublicEventsOutput } from '@org/grpc-types'

const eventRedisTag = (slug: string): string => `event:slug:${slug}`

const eventUserPageRedisTag = (userId: string, page: number): string => `event:userId:${userId}:page:${page}`

@Injectable()
export class EventsCacheSharedUtil {
  private GET_EVENT_TTL: number
  private GET_USER_PAGE_TTL: number

  constructor(
    @InjectRedis() private readonly cache: Redis,
    protected readonly config: ConfigService,
  ) {
    this.GET_EVENT_TTL = config.get<number>('TAVERN_EVENT_CACHE_TTL', 300)
    this.GET_USER_PAGE_TTL = config.get<number>('TAVERN_EVENT_USERPAGE_TTL', 90)
  }

  async invalidateUserEventPages(userId: string): Promise<void> {
    const pattern = `event:userId:${userId}:page:*`
    let cursor = '0'

    do {
      const [nextCursor, keys] = await this.cache.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
      cursor = nextCursor

      if (keys.length > 0) {
        await this.cache.del(...keys)
      }
    } while (cursor !== '0')
  }

  async invalidateEventBySlug(slug: string): Promise<void> {
    await this.cache.del(eventRedisTag(slug))
  }

  async getCachedEvent(slug: string): Promise<EventOutput | null> {
    const raw = await this.cache.get(eventRedisTag(slug))
    return raw ? JSON.parse(raw) : null
  }

  async setCachedEvent(slug: string, value: EventOutput): Promise<void> {
    await this.cache.set(eventRedisTag(slug), JSON.stringify(value), 'EX', this.GET_EVENT_TTL)
  }

  async getCachedUserPage(userId: string, page: number): Promise<PaginatedPublicEventsOutput | null> {
    const raw = await this.cache.get(eventUserPageRedisTag(userId, page))
    return raw ? JSON.parse(raw) : null
  }

  async setCachedUserPage(userId: string, page: number, value: PaginatedPublicEventsOutput): Promise<void> {
    await this.cache.set(eventUserPageRedisTag(userId, page), JSON.stringify(value), 'EX', this.GET_USER_PAGE_TTL)
  }
}
