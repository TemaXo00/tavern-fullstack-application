import { Module } from '@nestjs/common'

import { EventParticipantFeatureController } from './event-participant-feature.controller'
import { EventParticipantFeatureService } from './event-participant-feature.service'

@Module({
  controllers: [EventParticipantFeatureController],
  providers: [EventParticipantFeatureService],
})
export class EventParticipantFeatureModule {}
