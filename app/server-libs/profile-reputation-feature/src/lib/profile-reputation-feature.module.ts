import { Module } from '@nestjs/common'

import { ProfileReputationFeatureController } from './profile-reputation-feature.controller'
import { ProfileReputationFeatureService } from './profile-reputation-feature.service'

@Module({
  controllers: [ProfileReputationFeatureController],
  providers: [ProfileReputationFeatureService],
})
export class ProfileReputationFeatureModule {}
