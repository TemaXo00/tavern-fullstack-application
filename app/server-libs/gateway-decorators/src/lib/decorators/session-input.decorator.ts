import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { getSessionUtil } from '../utils/get-session.util.js'

import type { SessionInput } from '@org/grpc-types'

export const SessionInputParam = createParamDecorator((data: unknown, ctx: ExecutionContext): SessionInput => {
  return getSessionUtil(ctx)
})
