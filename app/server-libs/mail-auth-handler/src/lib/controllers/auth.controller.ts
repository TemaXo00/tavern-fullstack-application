import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { MailHandlerService } from '@org/mail-handler'
import {
  type AuthLoginMessage,
  type AuthMailForgotPassword,
  AUTHORIZATION_MESSAGES,
  type AuthRegisteredMessage,
  type AuthRestorePasswordMessage,
} from '@org/rmq-messages'

@Controller()
export class AuthController {
  constructor(private readonly mail: MailHandlerService) {}

  @EventPattern(AUTHORIZATION_MESSAGES.REGISTER)
  async handleUserRegistered(@Payload() data: AuthRegisteredMessage): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Register in TAVERN',
      template: 'auth/register',
      variables: {
        browser: data.session.browser,
        device: data.session.device,
        os: data.session.os,
      },
    })
  }

  @EventPattern(AUTHORIZATION_MESSAGES.LOGIN)
  async handleUserLoggedIn(@Payload() data: AuthLoginMessage): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'New login in TAVERN',
      template: 'auth/login',
      variables: {
        browser: data.session.browser,
        device: data.session.device,
        os: data.session.os,
      },
    })
  }

  @EventPattern(AUTHORIZATION_MESSAGES.FORGOT_PASSWORD)
  async handleUserForgotPassword(@Payload() data: AuthMailForgotPassword): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Forgot password in TAVERN',
      template: 'auth/forgot-password',
      variables: {
        token: data.token,
      },
    })
  }

  @EventPattern(AUTHORIZATION_MESSAGES.RESTORE_PASSWORD)
  async handleUserRestorePassword(@Payload() data: AuthRestorePasswordMessage): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Restore password in TAVERN',
      template: 'auth/reset-password',
      variables: {
        browser: data.session.browser,
        device: data.session.device,
        os: data.session.os,
      }
    })
  }
}
