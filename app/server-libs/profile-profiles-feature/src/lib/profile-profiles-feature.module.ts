import { Module } from '@nestjs/common';

import { ProfileProfilesFeatureController } from './profile-profiles-feature.controller';
import { ProfileProfilesFeatureService } from './profile-profiles-feature.service';

@Module({
  controllers: [ProfileProfilesFeatureController],
  providers: [ProfileProfilesFeatureService],
})
export class ProfileProfilesFeatureModule {}
