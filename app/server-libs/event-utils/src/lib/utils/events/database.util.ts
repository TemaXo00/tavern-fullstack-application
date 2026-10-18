import { Injectable } from '@nestjs/common'
import { EVENT_STATUSES_TO_GRPC } from '@org/enums'
import { EventDatabaseService, EventStatuses, EventWhereInput } from '@org/event-database'
import { PaginationUtil } from '@org/shared-utils'

import { EVENT_LIST_SELECTIONS, EVENT_METHODS_SELECTIONS, EVENT_OUTPUT_SELECTIONS } from '../helpers/selections'
import { mapEventMethodsResponse, mapEventOutputResponse } from './helpers/map-responses'
import { buildPrivatePaginationOutput, buildPublicPaginationOutput } from './helpers/pagination-response.helper'
import { buildPrivateQuery, buildPublicQuery } from './helpers/query.helper'
import { EventsCacheSharedUtil } from '../shared/cache.util'

import type {
  CreateEventGrpcInput,
  EventListGrpcOutput,
  EventMethodsOutput,
  EventOutput,
  EventPrivatePaginationGrpcInput,
  EventPublicPaginationGrpcInput,
  PaginatedPrivateEventsOutput,
  PaginatedPublicEventsOutput,
  UpdateEventDataInput,
} from '@org/grpc-types'

@Injectable()
export class EventEventsDatabaseUtil {
  constructor(
    private readonly db: EventDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly cache: EventsCacheSharedUtil,
  ) {}

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
      const cached = await this.cache.getCachedUserPage(userId, safePagination.page ?? 1)
      if (cached !== null) {
        return cached
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
      await this.cache.setCachedUserPage(userId, params.page, answer)
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

  async getEventBySlug(slug: string): Promise<EventOutput | null> {
    const cached = await this.cache.getCachedEvent(slug)
    if (cached !== null) {
      return cached
    }

    const response = await this.db.event.findUnique({
      where: { slug },
      select: EVENT_OUTPUT_SELECTIONS,
    })

    if (!response) {
      return null
    }

    const mapped = mapEventOutputResponse(response)
    await this.cache.setCachedEvent(slug, mapped)
    return mapped
  }

  async getCountOfTags(input: string[]): Promise<boolean> {
    const unique = [...new Set(input)]
    const count = await this.db.eventTag.count({ where: { slug: { in: unique } } })
    return count === unique.length
  }

  async getUserId(nickname: string): Promise<string | null> {
    const user = await this.db.eventUserSnapshot.findUnique({
      where: { nickname },
      select: { userId: true },
    })
    if (!user) {
      return null
    }
    return user.userId
  }

  async getUser(id: string): Promise<string | null> {
    const user = await this.db.eventUserSnapshot.findUnique({
      where: { userId: id },
      select: { userId: true },
    })
    if (!user) {
      return null
    }
    return user.userId
  }

  async getEventMethodsOutput(slug: string): Promise<EventMethodsOutput | null> {
    const event = await this.db.event.findUnique({
      where: { slug },
      select: EVENT_METHODS_SELECTIONS,
    })
    if (!event) {
      return null
    }
    return mapEventMethodsResponse(event)
  }

  async createEvent(input: CreateEventGrpcInput, eventSlug: string, userId: string): Promise<EventMethodsOutput> {
    const event = await this.db.event.create({
      data: {
        ...input,
        slug: eventSlug,
        organizerId: userId,
        leftPlaces: input.totalPlaces,
        waitingUsers: 0,
        tags: {
          connect: input.tags.map((slug) => ({ slug })),
        },
      },
      select: EVENT_METHODS_SELECTIONS,
    })

    await this.cache.invalidateUserEventPages(userId)

    return mapEventMethodsResponse(event)
  }

  async updateEventStatus(status: EventStatuses, eventSlug: string, userId: string): Promise<EventMethodsOutput> {
    const event = await this.db.event.update({
      where: {
        slug: eventSlug,
      },
      data: {
        status,
      },
      select: EVENT_METHODS_SELECTIONS,
    })
    await this.cache.invalidateEventBySlug(eventSlug)
    await this.cache.invalidateUserEventPages(userId)
    return mapEventMethodsResponse(event)
  }

  async updateEventOrganizer(
    eventSlug: string,
    newOrganizerId: string,
    oldOrganizerId: string,
  ): Promise<EventMethodsOutput> {
    const event = await this.db.event.update({
      where: {
        slug: eventSlug,
      },
      data: {
        organizerId: newOrganizerId,
      },
      select: EVENT_METHODS_SELECTIONS,
    })
    await this.cache.invalidateEventBySlug(eventSlug)
    await this.cache.invalidateUserEventPages(oldOrganizerId)
    await this.cache.invalidateUserEventPages(newOrganizerId)
    return mapEventMethodsResponse(event)
  }

  async updateEvent(data: UpdateEventDataInput): Promise<EventMethodsOutput> {
    const event = await this.db.event.update({
      where: { slug: data.slug },
      data: {
        ...(data.description !== undefined && { description: data.description }),
        ...(data.dateAndTime !== undefined && { dateAndTime: data.dateAndTime }),
        ...(data.totalPlaces !== undefined && { totalPlaces: data.totalPlaces }),
        ...(data.tags &&
          data.tags.length > 0 && {
            tags: {
              set: data.tags.map((slug) => ({ slug })),
            },
          }),
      },
      select: EVENT_METHODS_SELECTIONS,
    })

    await this.cache.invalidateEventBySlug(data.slug)
    await this.cache.invalidateUserEventPages(event.organizerId)

    return mapEventMethodsResponse(event)
  }

  async deleteEvent(slug: string): Promise<EventMethodsOutput> {
    const event = await this.db.event.delete({
      where: { slug },
      select: EVENT_METHODS_SELECTIONS,
    })
    await this.cache.invalidateEventBySlug(slug)
    await this.cache.invalidateUserEventPages(event.organizerId)

    return mapEventMethodsResponse(event)
  }
}
