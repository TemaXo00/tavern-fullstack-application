import type { GetLogsByActorInput, GetPaginatedLogsInput } from './log-input.data.js'
import type { PaginatedLogsOutput } from './log-output.data.js'
import type { ToObservable } from '../utils/to-observable.js'

export interface LogServiceContract {
  GetLogs(data: GetPaginatedLogsInput): Promise<PaginatedLogsOutput>
  GetLogsByActor(data: GetLogsByActorInput): Promise<PaginatedLogsOutput>
}

export type LogServiceObservableContract = ToObservable<LogServiceContract>
