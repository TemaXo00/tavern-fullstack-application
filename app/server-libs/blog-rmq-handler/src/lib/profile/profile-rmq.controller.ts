import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { PROFILES_MESSAGES, type UpdateProfile } from '@org/rmq-messages'

import { ProfileRmqService } from './profile-rmq.service'

@Controller()
export class ProfileRmqController {
  constructor(private readonly service: ProfileRmqService) {}

  @EventPattern(PROFILES_MESSAGES.UPDATE)
  async handleUpdateProfile(@Payload() data: UpdateProfile): Promise<void> {
    await this.service.handleProfileChangeNickname(data)
  }
}
