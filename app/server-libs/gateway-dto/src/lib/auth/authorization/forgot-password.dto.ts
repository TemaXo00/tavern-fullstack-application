import { Email } from '../../decorators/shared/email.decorator.js'

import type { ForgotPasswordSharedInput } from '@org/shared-types'

export class ForgotPasswordDto implements ForgotPasswordSharedInput {
  @Email()
  email: string
}
