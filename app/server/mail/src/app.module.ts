import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MailHandlerModule } from '@org/mail-handler'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailHandlerModule
  ],
})
export class AppModule {}
