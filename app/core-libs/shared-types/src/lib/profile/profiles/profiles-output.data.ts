import {
  ProfileAdvancedBaseOutput,
  ProfileBaseBaseOutput,
  ProfileListBaseOutput,
  ProfilePaginationAdvancedBaseOutput,
  ProfilePaginationBaseBaseOutput,
} from '@org/base-types'
import { ActivityType } from '@org/enums'

import { Replace } from '../../utils/replace.js'

export type ProfileBaseSharedOutput = Replace<ProfileBaseBaseOutput, { currentActivity: ActivityType }>

export type ProfileAdvancedSharedOutput = Replace<ProfileAdvancedBaseOutput, { currentActivity: ActivityType }>

export type ProfileListSharedOutput = Replace<ProfileListBaseOutput, { currentActivity: ActivityType }>

export type ProfilePaginationBaseSharedOutput = ProfilePaginationBaseBaseOutput

export type ProfilePaginationAdvancedSharedOutput = Replace<
  ProfilePaginationAdvancedBaseOutput,
  { currentActivity?: ActivityType }
>

export type PaginatedProfilesBaseSharedOutput = {
  pagination: ProfilePaginationBaseSharedOutput
  profiles: ProfileListSharedOutput[]
}

export type PaginatedProfilesGatewayAdvancedOutput = {
  pagination: ProfilePaginationAdvancedSharedOutput
  profiles: ProfileListSharedOutput[]
}
