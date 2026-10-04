import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ProfileDatabaseModule } from '@org/profile-database';
import { SharedUtilsModule } from '@org/shared-utils';

import { ProfileCacheUtil } from './utils/cache-util';
import { ProfileDatabaseUtil } from './utils/database.util';
import { ProfileUpdateStatusHelper } from './utils/helpers/update-status.helpers';
import { ProfileMapUtil } from './utils/map.util';
import { ProfileReputationUtil } from './utils/reputation.util';
import { ProfileValidationUtil } from './utils/validation.util';

const UTILS = [
  ProfileDatabaseUtil,
  ProfileValidationUtil,
  ProfileReputationUtil,
  ProfileUpdateStatusHelper,
  ProfileMapUtil,
  ProfileCacheUtil,
];

@Global()
@Module({
  imports: [
    ProfileDatabaseModule,
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
  ],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class ProfileUtilsModule {}
