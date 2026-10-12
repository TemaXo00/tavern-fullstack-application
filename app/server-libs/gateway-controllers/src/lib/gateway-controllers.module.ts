import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport, GrpcOptions } from '@nestjs/microservices';
import { workspaceRoot } from 'nx/src/utils/workspace-root';

import { AUTH_CONTROLLERS } from './auth/main';
import { EVENT_CONTROLLERS } from './event/main';
import { PROFILE_CONTROLLERS } from './profile/main';

const SERVICES: string[] = ['AUTH', 'PROFILE', 'EVENT'];

@Module({
  imports: [
    ClientsModule.registerAsync(
      SERVICES.map((service) => ({
        name: `${service}_CLIENT`,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>(
              `TAVERN_${service}_GRPC_URL`,
              `${service.toLowerCase()}-service:5000`,
            ),
            package: service.toLowerCase(),
            protoPath: join(
              workspaceRoot,
              `proto/${service.toLowerCase()}.proto`,
            ),
          },
        }),
        inject: [ConfigService],
      })),
    ),
  ],
  controllers: [
    ...AUTH_CONTROLLERS,
    ...PROFILE_CONTROLLERS,
    ...EVENT_CONTROLLERS,
  ],
})
export class GatewayControllersModule {}
