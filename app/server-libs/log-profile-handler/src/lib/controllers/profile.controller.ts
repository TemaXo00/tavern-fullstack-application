import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  type AdminCheckPaginatedProfiles,
  type AdminCheckProfile,
  PROFILES_MESSAGES,
  type UpdateProfile,
} from '@org/rmq-messages'

@Controller()
export class ProfileController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(PROFILES_MESSAGES.GET_PAGINATED_ADVANCED)
  async handleGetPaginatedProfiles(@Payload() data: AdminCheckPaginatedProfiles): Promise<void> {
    await this.log.createLog({
      microserviceName: 'PROFILE',
      serviceName: 'Profile',
      action: PROFILES_MESSAGES.GET_PAGINATED_ADVANCED,
      actionDesc: 'Admin requested paginated advanced profiles',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(PROFILES_MESSAGES.GET_PROFILE_ADVANCED)
  async handleCheckProfile(@Payload() data: AdminCheckProfile): Promise<void> {
    await this.log.createLog({
      microserviceName: 'PROFILE',
      serviceName: 'Profile',
      action: PROFILES_MESSAGES.GET_PROFILE_ADVANCED,
      actionDesc: 'Admin requested advanced profile',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(PROFILES_MESSAGES.UPDATE)
  async handleUpdateProfile(@Payload() data: UpdateProfile): Promise<void> {
    await this.log.createLog({
      microserviceName: 'PROFILE',
      serviceName: 'Profile',
      action: PROFILES_MESSAGES.UPDATE,
      actionDesc: 'User updated profile',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }
}
