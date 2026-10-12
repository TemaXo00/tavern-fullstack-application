import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';
import { EventTagFeatureModule } from '@org/event-tag-feature';
import { EventUtilsModule } from '@org/event-utils';
import { SharedUtilsModule } from '@org/shared-utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthAuthorizationCoreModule,
    SharedUtilsModule,
    EventUtilsModule,
    EventTagFeatureModule,
  ],
})
export class AppModule {}
