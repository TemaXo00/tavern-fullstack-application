import {
  ProfilePaginationAdvancedBaseInput,
  ProfilePaginationBaseBaseInput,
  UpdateProfileBaseRequestInput,
} from '@org/base-types'
import { ActivityType } from '@org/enums'

import { Replace } from '../../utils/replace.js'

export type ProfilePaginationBaseSharedInput = ProfilePaginationBaseBaseInput
export type UpdateProfileSharedInput = UpdateProfileBaseRequestInput
export type ProfilePaginationAdvancedSharedInput = Replace<
  ProfilePaginationAdvancedBaseInput,
  {
    currentActivity?: ActivityType
  }
>
