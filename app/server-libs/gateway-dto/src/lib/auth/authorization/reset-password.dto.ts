import { Password } from '../../decorators/auth/password.decorator.js'
import { Email } from '../../decorators/shared/email.decorator.js'
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js'

import type { ResetPasswordSharedInput } from '@org/shared-types'

export class ResetPasswordDto implements ResetPasswordSharedInput {
  @Email()
  email: string

  @Password()
  newPassword: string

  @Unvalidated({ required: true, description: 'Password confirmation' })
  newPasswordConfirmation: string
}
