import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { EVENT_STATUSES_TO_GRPC } from '@org/enums'
import { EventDatabaseService, EventWhereInput } from '@org/event-database'
import {
  EventListGrpcOutput,
  EventPrivatePaginationGrpcInput,
  EventPublicPaginationGrpcInput,
  PaginatedPrivateEventsOutput,
  PaginatedPublicEventsOutput,
} from '@org/grpc-types'
import { PaginationUtil } from '@org/shared-utils'
import Redis from 'ioredis'

import { EVENT_LIST_SELECTIONS } from '../helpers/selections'
import { buildPrivatePaginationOutput, buildPublicPaginationOutput } from './helpers/pagination-response.helper'
import { buildPrivateQuery, buildPublicQuery } from './helpers/query.helper'

// const eventRedisTag = (slug: string): string => {
//   return `event:slug:${slug}`;
// };

const eventUserPageRedisTag = (userId: string, page: number): string => {
  return `event:userId:${userId}:page:${page}`
}

@Injectable()
export class EventEventsDatabaseUtil {
  // private GET_EVENT_TTL: number
  private GET_USER_PAGE_TTL: number

  constructor(
    @InjectRedis() private readonly cache: Redis,
    protected readonly config: ConfigService,
    private readonly db: EventDatabaseService,
    private readonly paginationUtil: PaginationUtil,
  ) {
    // this.GET_EVENT_TTL = config.get<number>('TAVERN_EVENT_CACHE_TTL', 300)
    this.GET_USER_PAGE_TTL = config.get<number>('TAVERN_EVENT_USERPAGE_TTL', 90)
  }

  // GET Methods

  private async getPaginatedEventsList(
    where: EventWhereInput,
    skip: number,
    take: number,
  ): Promise<EventListGrpcOutput[]> {
    const events = await this.db.event.findMany({
      where,
      skip,
      take,
      orderBy: { dateAndTime: 'asc' },
      select: { ...EVENT_LIST_SELECTIONS },
    })
    return events.map((event) => {
      return { ...event, status: EVENT_STATUSES_TO_GRPC[event.status] }
    })
  }

  async getPublicPaginatedEvents(
    pagination: EventPublicPaginationGrpcInput,
    userId?: string,
  ): Promise<PaginatedPublicEventsOutput> {
    const safePagination = pagination || {}
    if (userId) {
      const redisCache = await this.cache.get(eventUserPageRedisTag(userId, safePagination.page ?? 1))
      if (redisCache !== null) {
        return JSON.parse(redisCache)
      }
    }
    const where = buildPublicQuery(safePagination, userId)
    const total = await this.db.event.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)

    const answer: PaginatedPublicEventsOutput = {
      pagination: buildPublicPaginationOutput(params, safePagination),
      events: await this.getPaginatedEventsList(where, params.skip, params.limit),
    }

    if (userId) {
      this.cache.set(eventUserPageRedisTag(userId, params.page), JSON.stringify(answer), 'EX', this.GET_USER_PAGE_TTL)
    }

    return answer
  }

  async getPrivatePaginatedEvents(
    pagination: EventPrivatePaginationGrpcInput,
    userId?: string,
  ): Promise<PaginatedPrivateEventsOutput> {
    const safePagination = pagination || {}
    const where = buildPrivateQuery(safePagination, userId)
    const total = await this.db.event.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)

    return {
      pagination: buildPrivatePaginationOutput(params, safePagination),
      events: await this.getPaginatedEventsList(where, params.skip, params.limit),
    }
  }
}
