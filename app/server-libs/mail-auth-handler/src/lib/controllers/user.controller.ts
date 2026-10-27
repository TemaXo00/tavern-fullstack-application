import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { MailHandlerService } from '@org/mail-handler'
import {
  type AdminBlockUserMail,
  type AdminSetUserActiveMessage,
  type AdminUnblockUserMessage,
  type DeleteUserMessage,
  USER_MESSAGES,
  type UserChangeEmailMessage,
  type UserChangePasswordMessage,
} from '@org/rmq-messages'

@Controller()
export class UserController {
  constructor(private readonly mail: MailHandlerService) {}

  @EventPattern(USER_MESSAGES.BLOCK)
  async handleBlock(@Payload() data: AdminBlockUserMail): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Block in TAVERN',
      template: 'auth/block',
      variables: {
        blockReason: data.blockReason,
        blockedFrom: data.blockedFrom,
        blockedUntil: data.blockedUntil,
      },
    })
  }

  @EventPattern(USER_MESSAGES.EARLY_UNBLOCK)
  async handleUnblock(@Payload() data: AdminUnblockUserMessage): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Unblock in TAVERN',
      template: 'auth/unblock',
      variables: {
        adminId: data.adminId,
      },
    })
  }

  @EventPattern(USER_MESSAGES.EMAIL_CHANGE)
  async handleEmailChange(@Payload() data: UserChangeEmailMessage): Promise<void> {
    await Promise.all([
      this.mail.sendMail({
        to: data.oldEmail,
        subject: 'Change email in TAVERN',
        template: 'auth/change-email-old',
        variables: {
          newEmail: data.newEmail,
          browser: data.session.browser,
          device: data.session.device,
          os: data.session.os,
        },
      }),
      this.mail.sendMail({
        to: data.newEmail,
        subject: 'Change email in TAVERN',
        template: 'auth/change-email-new',
        variables: {
          oldEmail: data.oldEmail,
          browser: data.session.browser,
          device: data.session.device,
          os: data.session.os,
        },
      }),
    ])
  }

  @EventPattern(USER_MESSAGES.PASSWORD)
  async handleChangePassword(@Payload() data: UserChangePasswordMessage): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Change password in TAVERN',
      template: 'auth/change-password',
      variables: {
        browser: data.session.browser,
        device: data.session.device,
        os: data.session.os,
      },
    })
  }

  @EventPattern(USER_MESSAGES.SET_ACTIVE)
  async handleActivateUser(@Payload() data: AdminSetUserActiveMessage): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Admin set you active in TAVERN',
      template: 'auth/set-active',
      variables: {
        adminId: data.adminId,
      },
    })
  }

  @EventPattern(USER_MESSAGES.DELETE)
  async handleDelete(@Payload() data: DeleteUserMessage): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Delete from TAVERN',
      template: 'auth/delete',
    })
  }
}
