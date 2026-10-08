import { Module } from '@nestjs/common';
import { AuthCoreModule } from '@org/auth-core';

@Module({
  imports: [AuthCoreModule],
  controllers: [],
  providers: [],
})
export class ActivityFeatureModule {}
