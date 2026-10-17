import { Email } from '../../decorators/shared/email.decorator.js'
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js'

import type { LoginSharedInput } from '@org/shared-types'

export class LoginDto implements LoginSharedInput {
  @Email()
  email: string

  @Unvalidated({ required: true, description: 'Login password' })
  password: string
}
