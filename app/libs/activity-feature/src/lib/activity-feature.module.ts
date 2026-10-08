import { Module } from '@nestjs/common';
import { AuthCoreModule } from '@org/auth-core';

import { ActivityFeatureController } from './activity-feature.controller';
import { ActivityFeatureService } from './activity-feature.service';

@Module({
  imports: [AuthCoreModule],
  controllers: [ActivityFeatureController],
  providers: [ActivityFeatureService],
})
export class ActivityFeatureModule {}
