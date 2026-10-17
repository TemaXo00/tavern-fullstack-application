import { Inject, Injectable } from '@nestjs/common'
import { AdminCheckPaginatedProfiles, AdminCheckProfile, PROFILES_MESSAGES, UpdateProfile } from '@org/rmq-messages'

import type { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class ProfileMessagesUtil {
  constructor(
    @Inject('LOG_CLIENT') private readonly log: ClientProxy,
    @Inject('EVENT_CLIENT') private readonly event: ClientProxy,
  ) {}

  sendAdminGetPaginatedProfiles(data: AdminCheckPaginatedProfiles): void {
    this.log.emit(PROFILES_MESSAGES.GET_PAGINATED_ADVANCED, data)
  }

  sendAdminCheckProfile(data: AdminCheckProfile): void {
    this.log.emit(PROFILES_MESSAGES.GET_PROFILE_ADVANCED, data)
  }

  sendUserUpdateProfile(data: UpdateProfile): void {
    this.log.emit(PROFILES_MESSAGES.UPDATE, data)
    this.event.emit(PROFILES_MESSAGES.UPDATE, data)
  }
}
