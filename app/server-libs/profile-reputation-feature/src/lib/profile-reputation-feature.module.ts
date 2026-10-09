import { Module } from '@nestjs/common';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';

import { ProfileReputationFeatureController } from './profile-reputation-feature.controller';
import { ProfileReputationFeatureService } from './profile-reputation-feature.service';

@Module({
  imports: [AuthAuthorizationCoreModule],
  controllers: [ProfileReputationFeatureController],
  providers: [ProfileReputationFeatureService],
})
export class ProfileReputationFeatureModule {}
