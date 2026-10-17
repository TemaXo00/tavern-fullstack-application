import { Email } from '../../decorators/shared/email.decorator.js'

import type { ChangeEmailSharedInput } from '@org/shared-types'

export class ChangeEmailDto implements ChangeEmailSharedInput {
  @Email()
  newEmail: string
}
