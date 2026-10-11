import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthAuthorizationCoreModule,
  ],
})
export class AppModule {}
