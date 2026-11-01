import { Module } from '@nestjs/common'

import { ProfileController } from './controllers/profile.controller'
import { ReputationController } from './controllers/reputation.controller'

@Module({
  controllers: [ProfileController, ReputationController],
})
export class LogProfileHandlerModule {}
