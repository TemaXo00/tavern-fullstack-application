import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { EVENT_MESSAGES } from '@org/validation-messages'

import { EventEventsDatabaseUtil } from './database.util'

import type { EventStatuses } from '@org/event-database'
import type { EventMethodsOutput, EventOutput } from '@org/grpc-types'

@Injectable()
export class EventEventsValidationUtil {
  constructor(private readonly db: EventEventsDatabaseUtil) {}

  async checkUserExists(type: 'by-id' | 'nickname', input: string): Promise<string> {
    let output: string | null = null
    switch (type) {
      case 'by-id': {
        output = await this.db.getUser(input)
        break
      }
      case 'nickname': {
        output = await this.db.getUserId(input)
        break
      }
    }
    if (!output) {
      throw new RpcException({
        message: EVENT_MESSAGES.USER_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }
    return output
  }

  async checkMethodsEventsExists(slug: string): Promise<EventMethodsOutput> {
    const event = await this.db.getEventMethodsOutput(slug)
    if (!event) {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }
    return event
  }

  async checkEventExists(slug: string, onlyPublic?: boolean): Promise<EventOutput> {
    const event = await this.db.getEventBySlug(slug, onlyPublic)
    if (!event) {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }
    return event
  }

  async checkEventPermission(userId: string, organizerId: string, eventStatus: EventStatuses): Promise<void> {
    if (eventStatus === 'DRAFT' && userId !== organizerId) {
      throw new RpcException({
        message: EVENT_MESSAGES.DRAFT_NOT_ORGANIZER,
        code: status.PERMISSION_DENIED,
      })
    }
  }

  async checkEventStatus(slug: string, eventStatus: EventStatuses, dateAndTime: Date, userId: string): Promise<void> {
    if (eventStatus === 'DRAFT') {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_DRAFT,
        code: status.PERMISSION_DENIED,
      })
    }
    if (eventStatus === 'CANCELLED') {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_CANCELLED,
        code: status.UNAVAILABLE,
      })
    }
    if (eventStatus === 'FINISHED') {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_FINISHED,
        code: status.UNAVAILABLE,
      })
    }
    const current = new Date()
    if (dateAndTime < current) {
      await this.db.updateEventStatus('FINISHED', slug, userId)
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_FINISHED,
        code: status.UNAVAILABLE,
      })
    }
  }

  async checkTagsExisting(tags: string[]): Promise<void> {
    if (!(await this.db.getCountOfTags(tags))) {
      throw new RpcException({
        message: EVENT_MESSAGES.ONE_OR_MANY_TAGS_NOT_FOUND,
        code: status.INVALID_ARGUMENT,
      })
    }
  }

  async checkSlugUnique(slug: string): Promise<void> {
    const uniqueSlug = await this.db.getEventBySlug(slug)
    if (uniqueSlug) {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_SLUG_FOUND,
        code: status.ALREADY_EXISTS,
      })
    }
  }

  checkOrganizer(userId: string, organizerId: string): void {
    if (userId !== organizerId) {
      throw new RpcException({
        message: EVENT_MESSAGES.ORGANIZER_PERMISSIONS,
        code: status.PERMISSION_DENIED,
      })
    }
  }

  checkEventIsDraft(eventStatus: EventStatuses): void {
    if (eventStatus !== 'DRAFT') {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_NOT_DRAFT,
        code: status.INVALID_ARGUMENT,
      })
    }
  }

  checkEventPublished(eventStatus: EventStatuses): void {
    if (eventStatus !== 'PUBLISHED') {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_NOT_PUBLISH,
        code: status.INVALID_ARGUMENT,
      })
    }
  }
}
