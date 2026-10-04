import { Module } from '@nestjs/common';
import { AuthCoreModule } from '@org/auth-core';

import { ProfileFeatureController } from './profile-feature.controller';
import { ProfileFeatureService } from './profile-feature.service';

@Module({
  imports: [AuthCoreModule],
  controllers: [ProfileFeatureController],
  providers: [ProfileFeatureService],
})
export class ProfileFeatureModule {}
