import { Module } from '@nestjs/common'

import { EventEventsFeatureController } from './event-events-feature.controller'
import { EventEventsFeatureService } from './event-events-feature.service'

@Module({
  controllers: [EventEventsFeatureController],
  providers: [EventEventsFeatureService],
})
export class EventEventsFeatureModule {}
