import { Password } from '../../decorators/auth/password.decorator.js';
import { Email } from '../../decorators/shared/email.decorator.js';

import type { ResetPasswordSharedInput } from '@org/shared-types';

export class ResetPasswordDto implements ResetPasswordSharedInput {
  @Email()
  email: string;

  @Password()
  newPassword: string;

  @Password()
  newPasswordConfirmation: string;
}
