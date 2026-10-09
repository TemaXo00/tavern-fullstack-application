import { ChangePasswordSharedInput } from '@org/shared-types';

import { Password } from '../../decorators/auth/password.decorator.js';
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js';

export class ChangePasswordDto implements ChangePasswordSharedInput {
  @Unvalidated({ required: true, description: 'Reset old password' })
  oldPassword: string;
  @Password()
  newPassword: string;
  @Password()
  newPasswordConfirmation: string;
}
