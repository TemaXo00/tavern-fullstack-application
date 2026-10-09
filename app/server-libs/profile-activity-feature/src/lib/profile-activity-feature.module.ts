import { Module } from '@nestjs/common';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';

import { ProfileActivityFeatureController } from './profile-activity-feature.controller';
import { ProfileActivityFeatureService } from './profile-activity-feature.service';

@Module({
  imports: [AuthAuthorizationCoreModule],
  controllers: [ProfileActivityFeatureController],
  providers: [ProfileActivityFeatureService],
})
export class ProfileActivityFeatureModule {}
