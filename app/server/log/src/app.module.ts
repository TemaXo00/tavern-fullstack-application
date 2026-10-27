import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core'
import { LogAuthHandlerModule } from '@org/log-auth-handler'
import { LogBlogHandlerModule } from '@org/log-blog-handler'
import { LogEventHandlerModule } from '@org/log-event-handler'
import { LogFeatureModule } from '@org/log-feature'
import { LogProfileHandlerModule } from '@org/log-profile-handler'
import { LogUtilModule } from '@org/log-util'
import { SharedUtilsModule } from '@org/shared-utils'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedUtilsModule,
    AuthAuthorizationCoreModule,
    LogUtilModule,
    LogAuthHandlerModule,
    LogProfileHandlerModule,
    LogEventHandlerModule,
    LogBlogHandlerModule,
    LogFeatureModule
  ],
})
export class AppModule {}
