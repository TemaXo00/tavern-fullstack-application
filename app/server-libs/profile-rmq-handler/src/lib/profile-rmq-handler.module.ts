import { Module } from '@nestjs/common'

import { AuthRmqFeatureController } from './services/auth/auth-rmq-feature.controller'
import { AuthRmqFeatureService } from './services/auth/auth-rmq-feature.service'
import { UserRmqFeatureController } from './services/auth/user-rmq-feature.controller'
import { UserRmqFeatureService } from './services/auth/user-rmq-feature.service'
import { ParticipantRmqController } from './services/event/participant-rmq-feature.controller'
import { ParticipantRmqService } from './services/event/participant-rmq-feature.service'

@Module({
  controllers: [AuthRmqFeatureController, UserRmqFeatureController, ParticipantRmqController],
  providers: [AuthRmqFeatureService, UserRmqFeatureService, ParticipantRmqService],
})
export class ProfileRmqHandlerModule {}
