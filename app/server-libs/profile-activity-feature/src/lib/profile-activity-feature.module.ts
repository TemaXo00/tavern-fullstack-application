import { Module } from '@nestjs/common';

import { ProfileActivityFeatureController } from './profile-activity-feature.controller';
import { ProfileActivityFeatureService } from './profile-activity-feature.service';

@Module({
  controllers: [ProfileActivityFeatureController],
  providers: [ProfileActivityFeatureService],
})
export class ProfileActivityFeatureModule {}
