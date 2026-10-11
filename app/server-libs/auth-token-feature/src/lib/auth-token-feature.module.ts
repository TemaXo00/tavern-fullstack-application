import { Module } from '@nestjs/common';

import { AuthTokenFeatureController } from './auth-token-feature.controller';
import { AuthTokenFeatureService } from './auth-token-feature.service';

@Module({
  controllers: [AuthTokenFeatureController],
  providers: [AuthTokenFeatureService],
})
export class AuthTokenFeatureModule {}
