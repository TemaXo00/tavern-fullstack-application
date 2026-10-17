import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { PROFILES_MESSAGES, type UpdateProfile } from '@org/rmq-messages'

import { ProfilesRmqService } from './profiles-rmq.service'

@Controller()
export class ProfilesRmqController {
  constructor(private readonly service: ProfilesRmqService) {}

  @EventPattern(PROFILES_MESSAGES.UPDATE)
  async handleUpdateProfile(@Payload() data: UpdateProfile): Promise<void> {
    await this.service.handleProfileChangeNickname(data)
  }
}
