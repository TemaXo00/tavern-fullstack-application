import type { Protected } from '../utils/protected.js'
import type { GetLogsByActorBaseInput, GetPaginatedLogsBaseInput, LogPaginationBaseInput } from '@org/base-types'

export type PaginatedLogsGrpcInput = LogPaginationBaseInput

export type GetPaginatedLogsInput = Protected<GetPaginatedLogsBaseInput>
export type GetLogsByActorInput = Protected<GetLogsByActorBaseInput>
