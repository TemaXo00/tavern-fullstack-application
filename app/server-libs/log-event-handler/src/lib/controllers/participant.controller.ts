import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  type AddParticipantMessage,
  type ChangeParticipantStatusMessage,
  type DeleteParticipantMessage,
  EVENT_PARTICIPANT_MESSAGES,
  type JoinEventMessage,
  type LeaveEventMessage,
} from '@org/rmq-messages'

@Controller()
export class ParticipantController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(EVENT_PARTICIPANT_MESSAGES.JOIN_EVENT)
  async handleJoinEvent(@Payload() data: JoinEventMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Participant',
      action: EVENT_PARTICIPANT_MESSAGES.JOIN_EVENT,
      actionDesc: 'User joined event',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }

  @EventPattern(EVENT_PARTICIPANT_MESSAGES.LEAVE_EVENT)
  async handleLeaveEvent(@Payload() data: LeaveEventMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Participant',
      action: EVENT_PARTICIPANT_MESSAGES.LEAVE_EVENT,
      actionDesc: 'User left event',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }

  @EventPattern(EVENT_PARTICIPANT_MESSAGES.EVENT_ADD)
  async handleAddParticipant(@Payload() data: AddParticipantMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Participant',
      action: EVENT_PARTICIPANT_MESSAGES.EVENT_ADD,
      actionDesc: 'Organizer added participant to event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_PARTICIPANT_MESSAGES.EVENT_DELETE)
  async handleDeleteParticipant(@Payload() data: DeleteParticipantMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Participant',
      action: EVENT_PARTICIPANT_MESSAGES.EVENT_DELETE,
      actionDesc: 'Organizer deleted participant from event',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }

  @EventPattern(EVENT_PARTICIPANT_MESSAGES.EVENT_CHANGE_STATUS)
  async handleChangeParticipantStatus(@Payload() data: ChangeParticipantStatusMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'EVENT',
      serviceName: 'Participant',
      action: EVENT_PARTICIPANT_MESSAGES.EVENT_CHANGE_STATUS,
      actionDesc: 'Organizer changed participant status',
      isAdminAction: false,
      logBody: data,
      actorId: data.organizerId,
    })
  }
}
