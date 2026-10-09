import { Module } from '@nestjs/common';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';

import { ProfileProfilesFeatureController } from './profile-profiles-feature.controller';
import { ProfileProfilesFeatureService } from './profile-profiles-feature.service';

@Module({
  imports: [AuthAuthorizationCoreModule],
  controllers: [ProfileProfilesFeatureController],
  providers: [ProfileProfilesFeatureService],
})
export class ProfileProfilesFeatureModule {}
