import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { EVENT_STATUSES_TO_GRPC, EventStatuses, GRPC_TO_PARTICIPANT_STATUSES, ParticipantStatuses } from '@org/enums'
import {
  EventDatabaseService,
  EventGetPayload,
  EventParticipantGetPayload,
  EventParticipantWhereInput,
  EventUserSnapshotGetPayload,
  EventWhereInput,
  Prisma,
} from '@org/event-database'
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
  PARTICIPANT_IN_EVENT_SELECTIONS,
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
import { mapParticipantInEvent, ParticipantInEvent } from './helpers/participant-in-event.helper'

const EVENT_LOCK_TTL_SECONDS = 30
const EVENT_LOCK_RETRY_DELAY_MS = 50
const EVENT_LOCK_ACQUIRE_TIMEOUT_MS = 5_000

const eventLockKey = (slug: string): string => `event-participant-lock:${slug}`

@Injectable()
export class EventParticipantDatabaseUtil {
  constructor(
    private readonly db: EventDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil,
    private readonly validateUtil: EventParticipantTransactionsValidateUtil,
    @InjectRedis() private readonly cache: Redis,
    private readonly eventCache: EventsCacheSharedUtil,
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

  async getParticipant(eventSlug: string, nickname: string): Promise<ParticipantInEvent | null> {
    const response = await this.db.eventParticipant.findFirst({
      where: {
        event: {
          slug: eventSlug,
        },
        user: {
          nickname: nickname,
        },
      },
      select: PARTICIPANT_IN_EVENT_SELECTIONS,
    })
    if (!response) {
      return null
    }
    return mapParticipantInEvent(response)
  }

  // UPDATE methods

  async updateStatus(userId: string, eventId: string, status: number): Promise<EventParticipantOutput> {
    const response = await this.db.eventParticipant.update({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
      data: {
        status: GRPC_TO_PARTICIPANT_STATUSES[status],
        isFixed: true,
      },
      select: PARTICIPANT_OUTPUT_SELECTIONS,
    })
    return mapParticipantOutput(response)
  }

  // JOIN/LEAVE Methods

  async joinToEvent(
    userType: EventSearchType,
    userInput: string,
    eventSlug: string,
    note?: string,
    organizerId?: string,
  ): Promise<EventParticipantOutput> {
    const response = await this.withEventLock(eventSlug, async () => {
      const participant = await this.db.$transaction(async (tx) => {
        // Check event and its specs
        const event = await this.findEventForTransaction(tx, eventSlug)

        if (organizerId) {
          this.validateUtil.checkUserIsOrganizer(organizerId, event.organizerId)
        }

        this.validateUtil.checkEventJoinBlocked(event.isJoinBlocked)
        this.validateUtil.checkEventNotFinished(event.dateAndTime)
        this.validateUtil.checkEventStatus(event.status as EventStatuses)

        // Check user and its specs
        const user = await this.findUserForTransaction(tx, userType, userInput)

        this.validateUtil.checkUserActive(user.isActive)

        // Check existing participation
        const existingParticipant = await this.findParticipantForTransaction(tx, user.userId, event.id)

        if (existingParticipant) {
          this.validateUtil.throwUserParticipant()
        }

        // Add to WAITLIST if no places remain
        if (event.leftPlaces === 0) {
          return this.addUserToWaitlist(tx, user.userId, event.id, note)
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
          return this.addUserToWaitlist(tx, user.userId, event.id, note)
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

      return participant
    })

    return mapParticipantOutput(response)
  }

  async leaveFromEvent(
    userType: EventSearchType,
    userInput: string,
    eventSlug: string,
    organizerId?: string,
  ): Promise<EventParticipantOutput> {
    const response = await this.withEventLock(eventSlug, async () => {
      const participant = await this.db.$transaction(async (tx) => {
        // Check event and its specs
        const event = await this.findEventForTransaction(tx, eventSlug)

        if (organizerId) {
          this.validateUtil.checkUserIsOrganizer(organizerId, event.organizerId)
        }

        this.validateUtil.checkEventNotFinished(event.dateAndTime)
        this.validateUtil.checkEventStatus(event.status as EventStatuses)

        // Check user and its specs
        const user = await this.findUserForTransaction(tx, userType, userInput)

        this.validateUtil.checkUserActive(user.isActive)

        // Check existing participation
        const existingParticipant = await this.findParticipantForTransaction(tx, user.userId, event.id)

        if (!existingParticipant) {
          this.validateUtil.throwUserNotParticipant()
        }

        this.validateUtil.checkParticipantStatus(existingParticipant.status)

        // Leave WAITLIST
        if (existingParticipant.status === 'WAITLIST') {
          await this.decrementWaitingUsers(tx, event.id)

          return tx.eventParticipant.delete({
            where: {
              userId_eventId: {
                userId: user.userId,
                eventId: event.id,
              },
            },
            select: PARTICIPANT_OUTPUT_SELECTIONS,
          })
        }

        // Find the first participant in WAITLIST
        const nextParticipant = await tx.eventParticipant.findFirst({
          where: {
            eventId: event.id,
            status: 'WAITLIST',
          },
          orderBy: {
            createdAt: 'asc',
          },
          select: {
            id: true,
          },
        })

        // Remove current participant
        const deletedParticipant = await tx.eventParticipant.delete({
          where: {
            userId_eventId: {
              userId: user.userId,
              eventId: event.id,
            },
          },
          select: PARTICIPANT_OUTPUT_SELECTIONS,
        })

        if (nextParticipant) {
          // Promote next participant
          await tx.eventParticipant.update({
            where: {
              id: nextParticipant.id,
            },
            data: {
              status: 'RECORDED',
            },
          })

          // Decrease waitlist counter
          await this.decrementWaitingUsers(tx, event.id)
        } else {
          // Release the place
          await tx.event.update({
            where: {
              id: event.id,
            },
            data: {
              leftPlaces: { increment: 1 },
            },
          })
        }

        return deletedParticipant
      })

      await this.eventCache.invalidateEventBySlug(eventSlug)

      return participant
    })

    return mapParticipantOutput(response)
  }

  // PRIVATE helpers

  private async withEventLock<T>(eventSlug: string, action: () => Promise<T>): Promise<T> {
    const key = eventLockKey(eventSlug)
    const token = randomUUID()
    const deadline = Date.now() + EVENT_LOCK_ACQUIRE_TIMEOUT_MS
    let acquired = false

    while (!acquired && Date.now() < deadline) {
      acquired = (await this.cache.set(key, token, 'EX', EVENT_LOCK_TTL_SECONDS, 'NX')) === 'OK'

      if (!acquired) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, EVENT_LOCK_RETRY_DELAY_MS)
        })
      }
    }

    if (!acquired) {
      this.validateUtil.throwEventLockBusy()
    }

    try {
      return await action()
    } finally {
      await this.cache.eval(
        `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end`,
        1,
        key,
        token,
      )
    }
  }

  private async findEventForTransaction(
    tx: Prisma.TransactionClient,
    eventSlug: string,
  ): Promise<EventGetPayload<{ select: typeof EVENT_TRANSACTION_SELECTION }>> {
    const event = await tx.event.findUnique({
      where: { slug: eventSlug },
      select: EVENT_TRANSACTION_SELECTION,
    })

    if (event === null) {
      this.validateUtil.throwEventInTransactionNotFound()
    }

    return event
  }

  private async findUserForTransaction(
    tx: Prisma.TransactionClient,
    userType: EventSearchType,
    userInput: string,
  ): Promise<EventUserSnapshotGetPayload<{ select: typeof USER_TRANSACTION_SELECTION }>> {
    const user = await tx.eventUserSnapshot.findUnique({
      where: userType === 'by-id' ? { userId: userInput } : { nickname: userInput },
      select: USER_TRANSACTION_SELECTION,
    })

    if (user === null) {
      this.validateUtil.throwUserInTransactionNotFound()
    }

    return user
  }

  private async findParticipantForTransaction(
    tx: Prisma.TransactionClient,
    userId: string,
    eventId: string,
  ): Promise<EventParticipantGetPayload<{ select: { id: true; status: true } }> | null> {
    return tx.eventParticipant.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      select: { id: true, status: true },
    })
  }

  private async addUserToWaitlist(
    tx: Prisma.TransactionClient,
    userId: string,
    eventId: string,
    note?: string,
  ): Promise<EventParticipantGetPayload<{ select: typeof PARTICIPANT_OUTPUT_SELECTIONS }>> {
    await tx.event.update({
      where: { id: eventId },
      data: {
        waitingUsers: { increment: 1 },
      },
    })

    return tx.eventParticipant.create({
      data: {
        userId,
        eventId,
        status: 'WAITLIST',
        note,
      },
      select: PARTICIPANT_OUTPUT_SELECTIONS,
    })
  }

  private async decrementWaitingUsers(tx: Prisma.TransactionClient, eventId: string): Promise<void> {
    const updated = await tx.event.updateMany({
      where: {
        id: eventId,
        waitingUsers: { gt: 0 },
      },
      data: {
        waitingUsers: { decrement: 1 },
      },
    })

    if (updated.count === 0) {
      throw new Error('Waiting users counter is inconsistent')
    }
  }

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
