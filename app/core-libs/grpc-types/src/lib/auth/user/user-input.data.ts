import {
  BlockUserBaseInput,
  ChangeEmailBaseInput,
  ChangePasswordBaseInput,
  GetAllUsersBaseInput,
  UserByIdBaseInput,
  UserDeleteBaseInput,
  UserPaginationBaseInput,
} from '@org/base-types'

import { Protected } from '../../utils/protected.js'

export type UserPaginationInput = UserPaginationBaseInput

export interface BlockUserGrpcInput extends BlockUserBaseInput {
  id: string
}

export type GetAllUsersInput = Protected<GetAllUsersBaseInput>
export type GetUserByIdInput = Protected<UserByIdBaseInput>
export type BlockUserInput = Protected<BlockUserGrpcInput>
export type UnblockUserInput = Protected<UserByIdBaseInput>
export type PromoteToModeratorInput = Protected<UserByIdBaseInput>
export type DemoteFromModeratorInput = Protected<UserByIdBaseInput>
export type ChangeEmailInput = Protected<ChangeEmailBaseInput>
export type ChangePasswordInput = Protected<ChangePasswordBaseInput>
export type SetUserInactiveInput = Protected<null>
export type ChangeUserToActiveInput = Protected<UserByIdBaseInput>
export type UserDeleteInput = Protected<UserDeleteBaseInput>
