import { UserDeleteSharedInput } from '@org/shared-types'

import { Password } from '../../decorators/auth/password.decorator.js'

export class DeleteUserDto implements UserDeleteSharedInput {
  @Password()
  password: string
}
