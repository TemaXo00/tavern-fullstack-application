import { CreateSocialBaseInput, DeleteSocialBaseInput, GetOtherUserSocialsBaseInput } from '@org/base-types'

import { Protected } from '../../utils/protected.js'

export type CreateSocialGrpcInput = CreateSocialBaseInput

export type GetMySocialsInput = Protected<null>
export type GetOtherUserSocialsInput = GetOtherUserSocialsBaseInput
export type CreateSocialInput = Protected<CreateSocialBaseInput>
export type DeleteSocialInput = Protected<DeleteSocialBaseInput>
