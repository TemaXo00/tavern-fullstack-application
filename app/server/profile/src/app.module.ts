import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';
import { ProfileActivityFeatureModule } from '@org/profile-activity-feature';
import { ProfileProfilesFeatureModule } from '@org/profile-profiles-feature';
import { ProfileReputationFeatureModule } from '@org/profile-reputation-feature';
import { ProfileRmqHandlerModule } from '@org/profile-rmq-handler';
import { ProfileUtilsModule } from '@org/profile-utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthAuthorizationCoreModule,
    ProfileUtilsModule,
    ProfileRmqHandlerModule,
    ProfileProfilesFeatureModule,
    ProfileReputationFeatureModule,
    ProfileActivityFeatureModule,
  ],
})
export class AppModule {}
