import { ActivityPaginationBaseInput } from '@org/base-types'
import { ActivityType } from '@org/enums'

import { Replace } from '../../utils/replace.js'

export type ActivityPaginationSharedInput = Replace<
  ActivityPaginationBaseInput,
  {
    activityType?: ActivityType
  }
>
