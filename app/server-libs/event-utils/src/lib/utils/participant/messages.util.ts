import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  AddParticipantMessage,
  ChangeParticipantStatusMessage,
  DeleteParticipantMessage,
  EVENT_PARTICIPANT_MESSAGES,
  JoinEventMessage,
  LeaveEventMessage,
} from '@org/rmq-messages'

@Injectable()
export class EventParticipantMessagesUtil {
  constructor(
    @Inject('LOG_CLIENT') private readonly log: ClientProxy,
    @Inject('PROFILE_CLIENT') private readonly profile: ClientProxy,
  ) {}

  join(data: JoinEventMessage): void {
    this.log.emit(EVENT_PARTICIPANT_MESSAGES.JOIN_EVENT, data)
  }

  leave(data: LeaveEventMessage): void {
    this.log.emit(EVENT_PARTICIPANT_MESSAGES.LEAVE_EVENT, data)
  }

  addParticipant(data: AddParticipantMessage): void {
    this.log.emit(EVENT_PARTICIPANT_MESSAGES.EVENT_ADD, data)
  }

  deleteParticipant(data: DeleteParticipantMessage): void {
    this.log.emit(EVENT_PARTICIPANT_MESSAGES.EVENT_DELETE, data)
  }

  changeStatus(data: ChangeParticipantStatusMessage): void {
    this.log.emit(EVENT_PARTICIPANT_MESSAGES.EVENT_CHANGE_STATUS, data)
    this.profile.emit(EVENT_PARTICIPANT_MESSAGES.EVENT_CHANGE_STATUS, data)
  }
}
