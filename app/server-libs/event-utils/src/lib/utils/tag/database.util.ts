import { Injectable } from '@nestjs/common'
import { EventDatabaseService, EventTagWhereInput } from '@org/event-database'
import {
  CreateEventTagGrpcInput,
  EventTagDetailedOutput,
  EventTagListOutput,
  EventTagOutput,
  EventTagPaginationGrpcInput,
  PaginatedEventTagsOutput,
  UpdateEventTagGrpcInput,
} from '@org/grpc-types'
import { PaginationUtil, StringValidationUtil } from '@org/shared-utils'
import { EVENT_MESSAGES } from '@org/validation-messages'

import {
  TAG_ADVANCED_OUTPUT_SELECTIONS,
  TAG_BASE_OUTPUT_SELECTIONS,
  TAG_LIST_OUTPUT_SELECTION,
} from '../helpers/selections'

@Injectable()
export class EventTagDatabaseUtil {
  constructor(
    private readonly db: EventDatabaseService,
    private readonly paginationUtil: PaginationUtil,
    private readonly stringUtil: StringValidationUtil,
  ) {}

  // GET Methods

  private async getTagListOutput(where: EventTagWhereInput, skip: number, take: number): Promise<EventTagListOutput[]> {
    return this.db.eventTag.findMany({
      where,
      skip,
      take,
      select: {
        ...TAG_LIST_OUTPUT_SELECTION,
      },
      orderBy: { createdAt: 'asc', slug: 'asc' },
    })
  }

  async getPaginatedTags(pagination: EventTagPaginationGrpcInput): Promise<PaginatedEventTagsOutput> {
    const safePagination = pagination || {}
    const where = this.buildQueryForTag(safePagination)
    const total = await this.db.eventTag.count({ where })
    const params = this.paginationUtil.getPaginationParams(total, safePagination.page, safePagination.limit)
    return {
      pagination: {
        ...params,
        search: safePagination.search,
      },
      tags: await this.getTagListOutput(where, params.skip, params.limit),
    }
  }

  async getTagBySlug(slug: string): Promise<EventTagDetailedOutput | null> {
    this.stringUtil.validateAnyString(slug, EVENT_MESSAGES.INVALID_TAG_SLUG_STRING)
    return await this.db.eventTag.findUnique({
      where: {
        slug,
      },
      select: { ...TAG_ADVANCED_OUTPUT_SELECTIONS },
    })
  }

  // CREATE Methods

  async createTag(data: CreateEventTagGrpcInput, slug: string): Promise<EventTagOutput> {
    this.stringUtil.validateAnyString(data.name, EVENT_MESSAGES.INVALID_TAG_NAME_STRING)
    this.stringUtil.validateAnyString(slug, EVENT_MESSAGES.INVALID_TAG_SLUG_STRING)
    return await this.db.eventTag.create({
      data: {
        ...data,
        slug,
      },
      select: { ...TAG_BASE_OUTPUT_SELECTIONS },
    })
  }

  // UPDATE Methods

  async updateTag(slug: string, data: UpdateEventTagGrpcInput): Promise<EventTagOutput> {
    return await this.db.eventTag.update({
      where: {
        slug,
      },
      data,
      select: { ...TAG_ADVANCED_OUTPUT_SELECTIONS },
    })
  }

  // DELETE Methods

  async deleteTag(slug: string): Promise<void> {
    this.stringUtil.validateAnyString(slug, EVENT_MESSAGES.INVALID_TAG_SLUG_STRING)
    await this.db.eventTag.delete({
      where: { slug },
    })
  }

  // QUERY BUILDERS

  buildQueryForTag(query: EventTagPaginationGrpcInput): EventTagWhereInput {
    const where: EventTagWhereInput = {}

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    return where
  }
}
