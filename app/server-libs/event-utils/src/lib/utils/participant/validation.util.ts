import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { ParticipantInPaginatedGrpcOutput, ParticipatedEventGrpcOutput } from '@org/grpc-types'
import { EVENT_MESSAGES } from '@org/validation-messages'

import { EventParticipantDatabaseUtil } from './database.util'
import { EventSearchType } from './helpers/types.helper'

@Injectable()
export class EventParticipantValidationUtil {
  constructor(private readonly db: EventParticipantDatabaseUtil) {}

  async checkUserExisting(type: EventSearchType, input: string): Promise<ParticipantInPaginatedGrpcOutput> {
    const user = await this.db.getUserSnapshot(type, input)

    if (!user) {
      throw new RpcException({
        message: EVENT_MESSAGES.USER_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }

    return user
  }

  async checkEventExisting(slug: string): Promise<ParticipatedEventGrpcOutput> {
    const event = await this.db.getEvent(slug)

    if (!event) {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }

    return event
  }
}
