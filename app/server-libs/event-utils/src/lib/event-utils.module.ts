import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProviderOptions, ClientsModule } from '@nestjs/microservices'
import { RedisModule } from '@nestjs-modules/ioredis'
import { EventDatabaseModule } from '@org/event-database'
import { RmqModule, RmqService } from '@org/rmq-config'
import { SharedUtilsModule } from '@org/shared-utils'

import { EVENTS_UTILS } from './utils/events/main'
import { PARTICIPANT_UTILS } from './utils/participant/main'
import { RMQ_UTILS } from './utils/rmq/main'
import { SHARED_UTILS } from './utils/shared/main'
import { TAG_UTILS } from './utils/tag/main'

const queues = ['log', 'profile']

@Global()
@Module({
  imports: [
    EventDatabaseModule,
    SharedUtilsModule,
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
  providers: [...TAG_UTILS, ...RMQ_UTILS, ...EVENTS_UTILS, ...SHARED_UTILS, ...PARTICIPANT_UTILS],
  exports: [...TAG_UTILS, ...RMQ_UTILS, ...EVENTS_UTILS, ...SHARED_UTILS, ...PARTICIPANT_UTILS],
})
export class EventUtilsModule {}
