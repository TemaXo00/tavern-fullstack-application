import { Global, Module } from '@nestjs/common';

import { AuthGatewayMapService } from './auth-map.service';
import { ProfileGatewayMapService } from './profile-map.service';

@Global()
@Module({
  providers: [AuthGatewayMapService, ProfileGatewayMapService],
  exports: [AuthGatewayMapService, ProfileGatewayMapService],
})
export class GatewayMapModule {}
