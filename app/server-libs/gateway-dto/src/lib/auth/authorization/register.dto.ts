import { Password } from '../../decorators/auth/password.decorator.js'
import { Email } from '../../decorators/shared/email.decorator.js'
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js'

import type { RegisterSharedInput } from '@org/shared-types'

export class RegisterDto implements RegisterSharedInput {
  @Email()
  email: string

  @Password()
  password: string

  @Unvalidated({ required: true, description: 'Password confirmation' })
  passwordConfirmation: string
}
