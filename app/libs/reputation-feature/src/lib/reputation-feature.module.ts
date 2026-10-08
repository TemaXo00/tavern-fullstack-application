import { Module } from '@nestjs/common';
import { AuthCoreModule } from '@org/auth-core';

import { ReputationFeatureController } from './reputation-feature.controller';
import { ReputationFeatureService } from './reputation-feature.service';

@Module({
  imports: [AuthCoreModule],
  controllers: [ReputationFeatureController],
  providers: [ReputationFeatureService],
})
export class ReputationFeatureModule {}
