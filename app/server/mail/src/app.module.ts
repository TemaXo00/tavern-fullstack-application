import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MailAuthHandlerModule } from '@org/mail-auth-handler'
import { MailHandlerModule } from '@org/mail-handler'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailHandlerModule,
    MailAuthHandlerModule,
  ],
})
export class AppModule {}
