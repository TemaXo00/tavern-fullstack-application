import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core'
import { GatewayAuthorizationModule } from '@org/gateway-authorization'
import { GatewayControllersModule } from '@org/gateway-controllers'
import { GatewayMapModule } from '@org/gateway-map'
import { SharedUtilsModule } from '@org/shared-utils'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthAuthorizationCoreModule,
    SharedUtilsModule,
    GatewayAuthorizationModule,
    GatewayMapModule,
    GatewayControllersModule,
  ],
})
export class AppModule {}
