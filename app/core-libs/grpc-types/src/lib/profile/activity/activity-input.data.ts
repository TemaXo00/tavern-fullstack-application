import { ActivityPaginationBaseInput, GetActivityByNicknameBaseInput, GetMyReputationBaseInput } from '@org/base-types'

import { Protected } from '../../utils/protected.js'

export type ActivityPaginationInput = ActivityPaginationBaseInput
export type GetMyActivityInput = Protected<GetMyReputationBaseInput>
export type GetActivityByNicknameInput = Protected<GetActivityByNicknameBaseInput>
