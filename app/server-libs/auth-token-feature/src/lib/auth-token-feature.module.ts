import { Module } from '@nestjs/common';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';

import { AuthTokenFeatureController } from './auth-token-feature.controller';
import { AuthTokenFeatureService } from './auth-token-feature.service';

@Module({
  imports: [AuthAuthorizationCoreModule],
  controllers: [AuthTokenFeatureController],
  providers: [AuthTokenFeatureService],
})
export class AuthTokenFeatureModule {}
