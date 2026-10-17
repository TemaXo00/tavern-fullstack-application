import { join } from 'path'

import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices'
import { PassportModule } from '@nestjs/passport'
import { workspaceRoot } from 'nx/src/utils/workspace-root'

import { AuthJWTGuard } from './guards/jwt.guard'
import { RolesGuard } from './guards/roles.guard'
import { CookieService } from './services/cookie.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_CLIENT',
        imports: [ConfigModule],
        useFactory: (config: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            url: config.get<string>('TAVERN_AUTH_GRPC_URL', 'auth-service:5000'),
            package: 'auth',
            protoPath: join(workspaceRoot, 'proto/auth.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ConfigModule,
    PassportModule,
  ],
  providers: [JwtStrategy, AuthJWTGuard, RolesGuard, CookieService],
  exports: [JwtStrategy, AuthJWTGuard, RolesGuard, CookieService],
})
export class GatewayAuthorizationModule {}
