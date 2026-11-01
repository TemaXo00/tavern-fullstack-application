import { Replace } from '../utils/replace.js'

import type { LogBaseOutput, LogPaginationBaseOutput } from '@org/base-types'

export type LogSharedOutput = Replace<LogBaseOutput, { logBody: unknown }>

export interface PaginatedLogsSharedOutput {
  pagination: LogPaginationBaseOutput
  logs: LogSharedOutput[]
}
