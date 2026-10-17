import { AuthRmqController } from './authorizatiojn/auth-rmq.controller'
import { AuthRmqService } from './authorizatiojn/auth-rmq.service'
import { UserRmqController } from './user/user-rmq.controller'
import { UserRmqService } from './user/user-rmq.service'

export const AUTH_SERVICES = [AuthRmqService, UserRmqService]
export const AUTH_CONTROLLERS = [AuthRmqController, UserRmqController]
