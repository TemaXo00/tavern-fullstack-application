import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import { type ChangeReputation, PROFILES_MESSAGES } from '@org/rmq-messages'

@Controller()
export class ReputationController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(PROFILES_MESSAGES.REPUTATION_CHANGE)
  async handleChangeReputation(@Payload() data: ChangeReputation): Promise<void> {
    await this.log.createLog({
      microserviceName: 'PROFILE',
      serviceName: 'Reputation',
      action: PROFILES_MESSAGES.REPUTATION_CHANGE,
      actionDesc: 'Admin changed user reputation',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }
}
