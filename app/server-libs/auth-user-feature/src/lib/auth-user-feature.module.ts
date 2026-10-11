import { Module } from '@nestjs/common';

import { AuthUserFeatureController } from './auth-user-feature.controller';
import { AuthUserFeatureService } from './auth-user-feature.service';

@Module({
  controllers: [AuthUserFeatureController],
  providers: [AuthUserFeatureService],
})
export class AuthUserFeatureModule {}
