import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { LogDatabaseUtil } from '@org/log-util'
import {
  type AdminCheckTokensMessage,
  type AdminDeleteInactiveTokensMessage,
  type AdminDeleteTokenMessage,
  type AdminGetTokenByIdMessage,
  type AdminSetTokenRevokedMessage,
  TOKEN_MESSAGES,
} from '@org/rmq-messages'

@Controller()
export class TokenController {
  constructor(private readonly log: LogDatabaseUtil) {}

  @EventPattern(TOKEN_MESSAGES.CHECK)
  async handleCheckTokens(@Payload() data: AdminCheckTokensMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Token',
      action: TOKEN_MESSAGES.CHECK,
      actionDesc: 'Admin requested paginated list of tokens',
      isAdminAction: true,
      logBody: data,
      actorId: data.id,
    })
  }

  @EventPattern(TOKEN_MESSAGES.BY_ID)
  async handleGetTokenById(@Payload() data: AdminGetTokenByIdMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Token',
      action: TOKEN_MESSAGES.BY_ID,
      actionDesc: 'Admin requested token by id',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(TOKEN_MESSAGES.REVOKE)
  async handleRevokeToken(@Payload() data: AdminSetTokenRevokedMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Token',
      action: TOKEN_MESSAGES.REVOKE,
      actionDesc: 'Admin revoked token',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(TOKEN_MESSAGES.DELETE_ONE)
  async handleDeleteToken(@Payload() data: AdminDeleteTokenMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Token',
      action: TOKEN_MESSAGES.DELETE_ONE,
      actionDesc: 'Admin deleted token by id',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }

  @EventPattern(TOKEN_MESSAGES.INACTIVE_DELETE)
  async handleDeleteInactiveTokens(@Payload() data: AdminDeleteInactiveTokensMessage): Promise<void> {
    await this.log.createLog({
      microserviceName: 'AUTH',
      serviceName: 'Token',
      action: TOKEN_MESSAGES.INACTIVE_DELETE,
      actionDesc: 'Admin deleted all inactive tokens',
      isAdminAction: true,
      logBody: data,
      actorId: data.adminId,
    })
  }
}
