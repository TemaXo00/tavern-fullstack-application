import { Module } from '@nestjs/common'

import { LogFeatureController } from './log-feature.controller'
import { LogFeatureService } from './log-feature.service'

@Module({
  controllers: [LogFeatureController],
  providers: [LogFeatureService],
})
export class LogFeatureModule {}
