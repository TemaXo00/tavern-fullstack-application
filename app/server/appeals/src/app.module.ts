import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedUtilsModule } from '@org/shared-utils'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedUtilsModule,
  ],
})
export class AppModule {}
