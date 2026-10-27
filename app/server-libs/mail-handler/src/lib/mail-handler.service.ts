import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '@nestjs-modules/mailer'

interface SendMailOptions {
  to: string
  subject: string
  template: string
  variables?: Record<string, unknown>
}

@Injectable()
export class MailHandlerService {
  private CLIENT_LINK: string
  private CURRENT_YEAR = new Date().getFullYear()

  constructor(
    private readonly sender: MailerService,
    protected readonly config: ConfigService,
  ) {
    this.CLIENT_LINK = config.get<string>('TAVERN_WEB_CLIENT_LINK', 'http://localhost:4200')
  }

  async sendMail(context: SendMailOptions): Promise<void> {
    await this.sender.sendMail({
      to: context.to,
      subject: context.subject,
      template: context.template,
      context: {
        ...context.variables,
        link: this.CLIENT_LINK,
        year: this.CURRENT_YEAR,
      },
    })
  }
}
