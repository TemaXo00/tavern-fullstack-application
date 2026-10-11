import { Module } from '@nestjs/common';

import { AuthSessionFeatureController } from './auth-session-feature.controller';
import { AuthSessionFeatureService } from './auth-session-feature.service';

@Module({
  controllers: [AuthSessionFeatureController],
  providers: [AuthSessionFeatureService],
})
export class AuthSessionFeatureModule {}
