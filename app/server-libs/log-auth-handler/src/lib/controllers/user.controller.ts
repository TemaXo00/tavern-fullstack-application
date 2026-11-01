import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  type AdminBlockUserMessage,
  type AdminDemoteUserMessage,
  type AdminPromoteUserMessage,
  type AdminSetUserActiveMessage,
  type AdminUnblockUserMessage,
  type DeleteUserMessage,
  type UserByIdAdminCheckMessage,
  type UserChangeEmailMessage,
  type UserChangePasswordMessage,
  USER_MESSAGES,
  type UserSetInactiveMessage,
  type UsersCheckByAdminMessage,
} from '@org/rmq-messages'

@Controller()
export class UserController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(USER_MESSAGES.CHECK)
  async handleCheckUsers(@Payload() data: UsersCheckByAdminMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.CHECK,
      actionDesc: 'Admin requested paginated list of users',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(USER_MESSAGES.BY_ID)
  async handleGetUserById(@Payload() data: UserByIdAdminCheckMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.BY_ID,
      actionDesc: 'Admin requested user by id',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(USER_MESSAGES.BLOCK)
  async handleBlockUser(@Payload() data: AdminBlockUserMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.BLOCK,
      actionDesc: 'Admin blocked user',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(USER_MESSAGES.EARLY_UNBLOCK)
  async handleEarlyUnblockUser(@Payload() data: AdminUnblockUserMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.EARLY_UNBLOCK,
      actionDesc: 'Admin unblocked user before blockedUntil date',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(USER_MESSAGES.PROMOTE)
  async handlePromoteUser(@Payload() data: AdminPromoteUserMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.PROMOTE,
      actionDesc: 'Admin promoted user to moderator',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(USER_MESSAGES.DEMOTE)
  async handleDemoteUser(@Payload() data: AdminDemoteUserMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.DEMOTE,
      actionDesc: 'Admin demoted user from moderator',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(USER_MESSAGES.EMAIL_CHANGE)
  async handleChangeEmail(@Payload() data: UserChangeEmailMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.EMAIL_CHANGE,
      actionDesc: 'User changed email',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }

  @EventPattern(USER_MESSAGES.PASSWORD)
  async handleChangePassword(@Payload() data: UserChangePasswordMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.PASSWORD,
      actionDesc: 'User changed password',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }

  @EventPattern(USER_MESSAGES.SET_INACTIVE)
  async handleSetInactive(@Payload() data: UserSetInactiveMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.SET_INACTIVE,
      actionDesc: 'User deactivated own account',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }

  @EventPattern(USER_MESSAGES.SET_ACTIVE)
  async handleSetActive(@Payload() data: AdminSetUserActiveMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.SET_ACTIVE,
      actionDesc: 'Admin activated user account',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(USER_MESSAGES.DELETE)
  async handleDeleteUser(@Payload() data: DeleteUserMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'User',
      action: USER_MESSAGES.DELETE,
      actionDesc: 'User deleted own account',
      isAdminAction: false,
      logBody: data,
      actorId: data.userId,
    })
  }
}
