import { Global, Module } from '@nestjs/common'

import { AuthGatewayMapService } from './auth-map.service'
import { EventGatewayMapService } from './event-map.service'
import { LogGatewayMapService } from './log-map.service'
import { ProfileGatewayMapService } from './profile-map.service'

const SERIVCES = [AuthGatewayMapService, ProfileGatewayMapService, EventGatewayMapService, LogGatewayMapService]

@Global()
@Module({
  providers: [...SERIVCES],
  exports: [...SERIVCES],
})
export class GatewayMapModule {}
