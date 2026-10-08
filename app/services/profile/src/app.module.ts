import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActivityFeatureModule } from '@org/activity-feature';
import { ProfileFeatureModule } from '@org/profile-feature';
import { ProfileRmqFeatureModule } from '@org/profile-rmq-feature';
import { ProfileUtilsModule } from '@org/profile-utils';
import { ReputationFeatureModule } from '@org/reputation-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProfileUtilsModule,
    ProfileRmqFeatureModule,
    ProfileFeatureModule,
    ReputationFeatureModule,
    ActivityFeatureModule,
  ],
})
export class AppModule {}
