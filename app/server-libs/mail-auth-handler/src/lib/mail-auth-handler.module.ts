import { Module } from '@nestjs/common'

import { AuthController } from './controllers/auth.controller'
import { UserController } from './controllers/user.controller'

@Module({
  controllers: [AuthController, UserController],
})
export class MailAuthHandlerModule {}
