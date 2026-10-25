import { Injectable } from '@nestjs/common'
import { EVENT_STATUSES_TO_GRPC } from '@org/enums'
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

import {
  PARTICIPANT_IN_PAGINATION_SELECTIONS,
  PARTICIPANT_OUTPUT_SELECTIONS,
  PARTICIPATED_EVENTS_LIST_SELECTIONS,
} from '../helpers/selections'
import { mapParticipantOutput } from './helpers/participant-map.helper'
import { buildEventParticipantsQuery, buildParticipatedEventsQuery } from './helpers/query-builders'
import { EventSearchType } from './helpers/types.helper'

@Injectable()
export class EventParticipantDatabaseUtil {
  constructor(
    private readonly db: EventDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil,
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
