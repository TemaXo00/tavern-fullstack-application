import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { type ChangeParticipantStatusMessage, EVENT_PARTICIPANT_MESSAGES } from '@org/rmq-messages'

import { ParticipantRmqService } from './participant-rmq-feature.service'

@Controller()
export class ParticipantRmqController {
  constructor(private readonly service: ParticipantRmqService) {}

  @EventPattern(EVENT_PARTICIPANT_MESSAGES.EVENT_CHANGE_STATUS)
  async handleChangeStatus(@Payload() data: ChangeParticipantStatusMessage): Promise<void> {
    await this.service.handleParticipantChangeStatus(data)
  }
}
