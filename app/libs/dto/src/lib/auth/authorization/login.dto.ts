import { Email } from '../../decorators/shared/email.decorator.js';
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js';

import type { LoginBaseInput } from '@org/types';

export class LoginDto implements LoginBaseInput {
  @Email()
  email: string;

  @Unvalidated({ required: true, description: 'Login password' })
  password: string;
}
