import { join } from 'path'

import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { workspaceRoot } from 'nx/src/utils/workspace-root'

import { MailHandlerService } from './mail-handler.service'

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        defaults: {
          from: config.getOrThrow<string>('TAVERN_MAIL_FROM'),
        },
        template: {
          dir: join(workspaceRoot, 'mail-templates'),
          adapter: new EjsAdapter(),
        },
        transport: {
          host: config.getOrThrow<string>('TAVERN_MAIL_TRANSPORT_HOST'),
          port: config.getOrThrow<number>('TAVERN_MAIL_TRANSPORT_PORT'),
          secure: config.get<string>('TAVERN_MAIL_SECURE_ENABLE', 'false') === 'true',
          auth: {
            user: config.getOrThrow<string>('TAVERN_MAIL_USER'),
            pass: config.getOrThrow<string>('TAVERN_MAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  providers: [MailHandlerService],
  exports: [MailHandlerService],
})
export class MailHandlerModule {}
