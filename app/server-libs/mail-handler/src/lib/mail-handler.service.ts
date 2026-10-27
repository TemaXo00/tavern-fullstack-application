import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

interface SendMailOptions {
  to: string
  subject: string
  template: string
  variables?: Record<string, unknown>
}

@Injectable()
export class MailHandlerService {
  constructor(private readonly sender: MailerService) {}

  async sendMail(context: SendMailOptions): Promise<void> {
    await this.sender.sendMail({
      to: context.to,
      subject: context.subject,
      template: context.template,
      context: context.variables ?? {},
    })
  }
}
