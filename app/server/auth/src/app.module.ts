import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';
import { AuthAuthorizationFeatureModule } from '@org/auth-authorization-feature';
import { AuthSessionFeatureModule } from '@org/auth-session-feature';
import { AuthTokenFeatureModule } from '@org/auth-token-feature';
import { AuthUserFeatureModule } from '@org/auth-user-feature';
import { AuthUtilsModule } from '@org/auth-utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthAuthorizationCoreModule,
    AuthUtilsModule,
    AuthAuthorizationFeatureModule,
    AuthSessionFeatureModule,
    AuthTokenFeatureModule,
    AuthUserFeatureModule,
  ],
})
export class AppModule {}
