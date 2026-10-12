import { Module } from '@nestjs/common';

import { TagFeatureController } from './event-tag-feature.controller';
import { TagFeatureService } from './event-tag-feature.service';

@Module({
  controllers: [TagFeatureController],
  providers: [TagFeatureService],
})
export class EventTagFeatureModule {}
