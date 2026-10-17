import { UserBaseEntity } from '@org/base-types'
import { Roles } from '@org/enums'

import { Replace } from '../../utils/replace.js'

export type UserSharedEntity = Replace<UserBaseEntity, { role: Roles }>
