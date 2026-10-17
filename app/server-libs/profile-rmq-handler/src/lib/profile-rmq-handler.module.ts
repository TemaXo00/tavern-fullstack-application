import { Module } from '@nestjs/common'

import { AuthRmqFeatureController } from './services/auth/auth-rmq-feature.controller'
import { AuthRmqFeatureService } from './services/auth/auth-rmq-feature.service'
import { UserRmqFeatureController } from './services/auth/user-rmq-feature.controller'
import { UserRmqFeatureService } from './services/auth/user-rmq-feature.service'

@Module({
  controllers: [AuthRmqFeatureController, UserRmqFeatureController],
  providers: [AuthRmqFeatureService, UserRmqFeatureService],
})
export class ProfileRmqHandlerModule {}
