import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProviderOptions, ClientsModule } from '@nestjs/microservices'
import { RedisModule } from '@nestjs-modules/ioredis'
import { ProfileDatabaseModule } from '@org/profile-database'
import { RmqModule, RmqService } from '@org/rmq-config'

import { ProfileCacheUtil } from './utils/cache-util'
import { ProfileDatabaseUtil } from './utils/database.util'
import { ProfileUpdateStatusHelper } from './utils/helpers/update-status.helpers'
import { ProfileMapUtil } from './utils/map.util'
import { ProfileMessagesUtil } from './utils/messsages.util'
import { ProfileReputationUtil } from './utils/reputation.util'
import { ProfileValidationUtil } from './utils/validation.util'

const UTILS = [
  ProfileDatabaseUtil,
  ProfileValidationUtil,
  ProfileReputationUtil,
  ProfileUpdateStatusHelper,
  ProfileMapUtil,
  ProfileCacheUtil,
  ProfileMessagesUtil,
]

const queues: string[] = ['log', 'event', 'mail']

@Global()
@Module({
  imports: [
    ProfileDatabaseModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>('TAVERN_REDIS_URL', 'localhost:6379'),
        options: {
          password: config.get<string>('TAVERN_REDIS_PASSWORD', '123456'),
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync(
      queues.map((queue) => ({
        name: `${queue.toUpperCase()}_CLIENT`,
        imports: [RmqModule],
        useFactory: (rmq: RmqService): ClientProviderOptions => {
          return rmq.getRmqConfig(queue)
        },
        inject: [RmqService],
      })),
    ),
  ],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class ProfileUtilsModule {}
