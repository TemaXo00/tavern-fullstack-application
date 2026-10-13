import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';
import { EventEventsFeatureModule } from '@org/event-events-feature';
import { EventParticipantFeatureModule } from '@org/event-participant-feature';
import { EventRmqHandlerModule } from '@org/event-rmq-handler';
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
    EventEventsFeatureModule,
    EventParticipantFeatureModule,
    EventRmqHandlerModule,
  ],
})
export class AppModule {}
