import { Module } from '@nestjs/common'

import { AuthController } from './controllers/auth.controller'
import { SessionController } from './controllers/session.controller'
import { TokenController } from './controllers/token.controller'
import { UserController } from './controllers/user.controller'

@Module({
  controllers: [AuthController, SessionController, TokenController, UserController],
})
export class LogAuthHandlerModule {}
