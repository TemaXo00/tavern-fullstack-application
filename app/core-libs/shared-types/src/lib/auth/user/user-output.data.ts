import { UserBaseOutput, UserPaginationBaseOutput } from '@org/base-types'
import { Roles } from '@org/enums'

import { Replace } from '../../utils/replace.js'

export type UserPaginationSharedOutput = Replace<UserPaginationBaseOutput, { role?: Roles }>
export type UserSharedOutput = Replace<UserBaseOutput, { role: Roles }>

export type PaginatedUserSharedOutput = {
  pagination: UserPaginationSharedOutput
  users: UserSharedOutput[]
}
