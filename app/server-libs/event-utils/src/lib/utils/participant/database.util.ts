import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { EVENT_STATUSES_TO_GRPC, EventStatuses } from '@org/enums'
import { EventDatabaseService, EventParticipantWhereInput, EventWhereInput } from '@org/event-database'
import {
  EventParticipantOutput,
  EventParticipantPaginationGrpcInput,
  PaginatedEventParticipantsOutput,
  PaginatedParticipatedEventsOutput,
  ParticipantInPaginatedGrpcOutput,
  ParticipatedEventGrpcOutput,
  ParticipatedEventsPaginationGrpcInput,
} from '@org/grpc-types'
import { PaginationUtil, StringValidationUtil } from '@org/shared-utils'
import { EVENT_MESSAGES, SHARED_MESSAGES } from '@org/validation-messages'
import Redis from 'ioredis'

import {
  PARTICIPANT_IN_PAGINATION_SELECTIONS,
  PARTICIPANT_OUTPUT_SELECTIONS,
  PARTICIPATED_EVENTS_LIST_SELECTIONS,
} from '../helpers/selections'
import { mapParticipantOutput } from './helpers/participant-map.helper'
import { buildEventParticipantsQuery, buildParticipatedEventsQuery } from './helpers/query-builders'
import { EventSearchType } from './helpers/search-types.helper'
import { EVENT_TRANSACTION_SELECTION, USER_TRANSACTION_SELECTION } from './helpers/transactions-selection.helper'
import { EventParticipantTransactionsValidateUtil } from './transactions-validate.util'
import { EventsCacheSharedUtil } from '../shared/cache.util'

@Injectable()
export class EventParticipantDatabaseUtil {
  constructor(
    private readonly db: EventDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil,
    private readonly validateUtil: EventParticipantTransactionsValidateUtil,
    @InjectRedis() private readonly cache: Redis,
    private readonly eventCache: EventsCacheSharedUtil
  ) {}

  // QUERY Methods

  async getParticipatedEventsByUser(
    user: ParticipantInPaginatedGrpcOutput,
    pagination: ParticipatedEventsPaginationGrpcInput,
  ): Promise<PaginatedParticipatedEventsOutput> {
    const safePagination = pagination || {}

    const where = buildParticipatedEventsQuery(user.userId, pagination)
    const total = await this.db.event.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)

    return {
      participant: user,
      pagination: { ...params, status: safePagination.status },
      events: await this.getListOfParticipatedEvents(where, params.skip, params.limit),
    }
  }

  async getEventParticipants(
    event: ParticipatedEventGrpcOutput,
    pagination: EventParticipantPaginationGrpcInput,
  ): Promise<PaginatedEventParticipantsOutput> {
    const safePagination = pagination || {}

    const where = buildEventParticipantsQuery(event.slug, pagination)
    const total = await this.db.eventParticipant.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)

    return {
      event,
      pagination: { ...params, status: safePagination.status },
      participants: await this.getListOfParticipants(where, params.skip, params.limit),
    }
  }

  // GET Methods

  async getUserSnapshot(type: EventSearchType, input: string): Promise<ParticipantInPaginatedGrpcOutput | null> {
    switch (type) {
      case 'by-id': {
        this.stringUtil.validateUUIDV7(input)
        break
      }
      case 'by-nickname': {
        this.stringUtil.validateAnyString(input, EVENT_MESSAGES.INVALID_NICKNAME_STRING)
        break
      }
      default: {
        this.stringUtil.validateAnyString(input, SHARED_MESSAGES.INVALID_DATA)
      }
    }
    return this.db.eventUserSnapshot.findUnique({
      where: type === 'by-id' ? { userId: input } : { nickname: input },
      select: PARTICIPANT_IN_PAGINATION_SELECTIONS,
    })
  }

  async getEvent(slug: string): Promise<ParticipatedEventGrpcOutput | null> {
    const answer = await this.db.event.findUnique({
      where: {
        slug,
      },
      select: PARTICIPATED_EVENTS_LIST_SELECTIONS,
    })

    if (!answer) {
      return null
    }

    return {
      ...answer,
      status: EVENT_STATUSES_TO_GRPC[answer.status],
    }
  }

  // JOIN/LEAVE Methods

  async joinToEvent(userId: string, eventSlug: string, note?: string): Promise<EventParticipantOutput> {
    const response = await this.db.$transaction(async (tx) => {
      // Check event and its specs
      const event = await tx.event.findUnique({
        where: { slug: eventSlug },
        select: EVENT_TRANSACTION_SELECTION,
      })

      if (event === null) {
        this.validateUtil.throwEventInTransactionNotFound()
      }

      this.validateUtil.checkEventJoinBlocked(event.isJoinBlocked)
      this.validateUtil.checkEventNotFinished(event.dateAndTime)
      this.validateUtil.checkEventStatus(event.status as EventStatuses)

      // Check user and its specs
      const user = await tx.eventUserSnapshot.findUnique({
        where: { userId },
        select: USER_TRANSACTION_SELECTION,
      })

      if (user === null) {
        this.validateUtil.throwUserInTransactionNotFound()
      }

      this.validateUtil.checkUserActive(user.isActive)

      // Check existing participation
      const existingParticipant = await tx.eventParticipant.findUnique({
        where: {
          userId_eventId: {
            userId: user.userId,
            eventId: event.id,
          },
        },
        select: { id: true },
      })

      if (existingParticipant) {
        this.validateUtil.throwUserParticipant()
      }

      // Check Redis lock when only one place remains
      let inCache = false

      if (event.leftPlaces === 1) {
        const result = await this.cache.set(`join-lock:${event.id}`, user.userId, 'EX', 30, 'NX')

        inCache = result !== 'OK'
      }

      // Add to WAITLIST if no places remain or the lock is occupied
      if (inCache || event.leftPlaces === 0) {
        await tx.event.update({
          where: { id: event.id },
          data: {
            waitingUsers: { increment: 1 },
          },
        })

        return tx.eventParticipant.create({
          data: {
            userId: user.userId,
            eventId: event.id,
            status: 'WAITLIST',
            note,
          },
          select: PARTICIPANT_OUTPUT_SELECTIONS,
        })
      }

      // Atomically claim a place in PostgreSQL
      const updated = await tx.event.updateMany({
        where: {
          id: event.id,
          leftPlaces: { gt: 0 },
        },
        data: {
          leftPlaces: { decrement: 1 },
        },
      })

      if (updated.count === 0) {
        await tx.event.update({
          where: { id: event.id },
          data: {
            waitingUsers: { increment: 1 },
          },
        })

        return tx.eventParticipant.create({
          data: {
            userId: user.userId,
            eventId: event.id,
            status: 'WAITLIST',
            note,
          },
          select: PARTICIPANT_OUTPUT_SELECTIONS,
        })
      }

      // Add to MAIN list
      return tx.eventParticipant.create({
        data: {
          userId: user.userId,
          eventId: event.id,
          status: 'RECORDED',
          note,
        },
        select: PARTICIPANT_OUTPUT_SELECTIONS,
      })
    })

    await this.eventCache.invalidateEventBySlug(eventSlug)

    return mapParticipantOutput(response)
  }

  // PRIVATE helpers

  private async getListOfParticipatedEvents(
    where: EventWhereInput,
    skip: number,
    take: number,
  ): Promise<ParticipatedEventGrpcOutput[]> {
    const answer = await this.db.event.findMany({
      where,
      skip,
      take,
      select: PARTICIPATED_EVENTS_LIST_SELECTIONS,
      orderBy: [{ dateAndTime: 'asc' }, { id: 'asc' }],
    })
    return answer.map((entry) => {
      return {
        ...entry,
        status: EVENT_STATUSES_TO_GRPC[entry.status],
      }
    })
  }

  private async getListOfParticipants(
    where: EventParticipantWhereInput,
    skip: number,
    take: number,
  ): Promise<EventParticipantOutput[]> {
    const answer = await this.db.eventParticipant.findMany({
      where,
      skip,
      take,
      select: PARTICIPANT_OUTPUT_SELECTIONS,
      orderBy: [{ createdAt: 'asc' }, { status: 'asc' }, { id: 'asc' }],
    })
    return answer.map((entry) => {
      return mapParticipantOutput(entry)
    })
  }
}
