import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  SESSION_MESSAGES,
  type SessionCheckByAdminMessage,
  type UserRemoveAllSessionsMessage,
  type UserRemoveSessionMessage,
  type UserUpdatedSessionNameMessage,
} from '@org/rmq-messages'

@Controller()
export class SessionController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(SESSION_MESSAGES.CHECK)
  async handleCheckSessions(@Payload() data: SessionCheckByAdminMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Session',
      action: SESSION_MESSAGES.CHECK,
      actionDesc: 'Admin requested sessions of a specific user',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(SESSION_MESSAGES.CHANGE_NAME)
  async handleChangeSessionName(@Payload() data: UserUpdatedSessionNameMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Session',
      action: SESSION_MESSAGES.CHANGE_NAME,
      actionDesc: 'User changed local name of session',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }

  @EventPattern(SESSION_MESSAGES.DELETE)
  async handleDeleteSession(@Payload() data: UserRemoveSessionMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Session',
      action: SESSION_MESSAGES.DELETE,
      actionDesc: 'User deleted session by id',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }

  @EventPattern(SESSION_MESSAGES.ALL_DELETE)
  async handleDeleteAllSessions(@Payload() data: UserRemoveAllSessionsMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Session',
      action: SESSION_MESSAGES.ALL_DELETE,
      actionDesc: 'User deleted all other sessions',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }
}
