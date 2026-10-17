import {
  GetProfileByNicknameBaseInput,
  GetProfilesAdvancedBaseInput,
  GetProfilesBaseInput,
  ProfilePaginationAdvancedBaseInput,
  ProfilePaginationBaseBaseInput,
  UpdateProfileBaseInput,
  UpdateProfileBaseRequestInput,
} from '@org/base-types'

import { Protected } from '../../utils/protected.js'

export type ProfilePaginationBaseInput = ProfilePaginationBaseBaseInput
export type ProfilePaginationAdvancedInput = ProfilePaginationAdvancedBaseInput
export type GetMeInput = Protected<null>
export type GetProfilesInput = GetProfilesBaseInput
export type GetProfilesAdvancedInput = Protected<GetProfilesAdvancedBaseInput>
export type GetProfileByNicknameInput = GetProfileByNicknameBaseInput
export type GetProfileByNicknameAdvancedInput = Protected<GetProfileByNicknameBaseInput>
export type UpdateProfileInput = Protected<UpdateProfileBaseInput>
export type UpdateProfileRequestInput = UpdateProfileBaseRequestInput
