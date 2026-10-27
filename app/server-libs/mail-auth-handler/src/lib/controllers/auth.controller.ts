import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { MailHandlerService } from '@org/mail-handler'
import { AUTHORIZATION_MESSAGES, type AuthRegisteredMessage } from '@org/rmq-messages'

@Controller()
export class AuthController {
  constructor(private readonly mail: MailHandlerService) {}

  @EventPattern(AUTHORIZATION_MESSAGES.REGISTER)
  async handleUserRegistered(@Payload() data: AuthRegisteredMessage): Promise<void> {
    await this.mail.sendMail({
      to: data.email,
      subject: 'Register to TAVERN',
      template: 'auth/register',
    })
  }
}
