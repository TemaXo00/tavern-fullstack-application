import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import {
  EventStatuses,
  GRPC_TO_PARTICIPANT_STATUSES,
  PARTICIPANT_STATUSES_TO_GRPC,
  ParticipantStatuses,
} from '@org/enums'
import { ParticipantInPaginatedGrpcOutput, ParticipatedEventGrpcOutput } from '@org/grpc-types'
import { EVENT_MESSAGES } from '@org/validation-messages'

import { EventParticipantDatabaseUtil } from './database.util'
import { ParticipantInEvent } from './helpers/participant-in-event.helper'
import { EventSearchType } from './helpers/search-types.helper'

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

  async checkParticipantExisting(eventSlug: string, nickname: string): Promise<ParticipantInEvent> {
    const participant = await this.db.getParticipant(eventSlug, nickname)

    if (!participant) {
      throw new RpcException({
        message: EVENT_MESSAGES.PARTICIPANT_NOT_FOUND,
        code: status.NOT_FOUND,
      })
    }

    return participant
  }

  checkStatusFixed(isFixed: boolean): void {
    if (isFixed) {
      throw new RpcException({
        message: EVENT_MESSAGES.USER_FIXED_STATUS,
        code: status.UNAVAILABLE,
      })
    }
  }

  checkEventStatus(eventStatus: EventStatuses): void {
    if (eventStatus !== 'FINISHED') {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_NOT_FINISHED,
        code: status.UNAVAILABLE,
      })
    }
  }

  checkParticipantStatusInput(inputStatus: number): void {
    const participantStatus = GRPC_TO_PARTICIPANT_STATUSES[inputStatus]
    if (participantStatus === 'WAITLIST' || participantStatus === 'RECORDED') {
      throw new RpcException({
        message: EVENT_MESSAGES.INCORRECT_PARTICIPANT_STATUS_CHANGE,
        code: status.INVALID_ARGUMENT,
      })
    }
  }

  checkUserOrganizer(organizerId: string, userId: string): void {
    if (organizerId !== userId) {
      throw new RpcException({
        message: EVENT_MESSAGES.ORGANIZER_PERMISSIONS,
        code: status.UNAVAILABLE,
      })
    }
  }
}
