import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProviderOptions, ClientsModule } from '@nestjs/microservices'
import { RedisModule } from '@nestjs-modules/ioredis'
import { BlogDatabaseModule } from '@org/blog-database'
import { RmqModule, RmqService } from '@org/rmq-config'
import { SharedUtilsModule } from '@org/shared-utils'

import { BlogDatabaseUtil } from './utils/database.util'
import { BlogMessagesUtil } from './utils/messages.util'
import { BlogValidationUtil } from './utils/validation.util'

const UTILS = [BlogDatabaseUtil, BlogValidationUtil, BlogMessagesUtil]
const queues = ['log']

@Global()
@Module({
  imports: [
    BlogDatabaseModule,
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
  providers: [...UTILS],
  exports: [...UTILS],
})
export class BlogUtilsModule {}
