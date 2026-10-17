import {
  ForgotPasswordBaseInput,
  LoginBaseInput,
  RefreshBaseInput,
  RegisterBaseInput,
  ResetPasswordBaseInput,
} from '@org/base-types';

import { WithSession } from '../../utils/with-session.js';

export type RegisterInput = WithSession<RegisterBaseInput>;
export type LoginInput = WithSession<LoginBaseInput>;
export type RefreshInput = WithSession<RefreshBaseInput>;
export type ResetPasswordInput = WithSession<ResetPasswordBaseInput & { token: string }>;
export type ForgotPasswordInput = ForgotPasswordBaseInput;
