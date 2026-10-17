import { ActivityBaseOutput, ActivityPaginationBaseOutput } from '@org/base-types'
import { ActivityType } from '@org/enums'

import { Replace } from '../../utils/replace.js'

export type ActivityPaginationSharedOutput = Replace<
  ActivityPaginationBaseOutput,
  {
    activityType?: ActivityType
  }
>

export type ActivitySharedOutput = Replace<
  ActivityBaseOutput,
  {
    status: ActivityType
  }
>

export interface PaginatedActivitySharedOutput {
  pagination: ActivityPaginationSharedOutput
  activityLogs: ActivitySharedOutput[]
}
