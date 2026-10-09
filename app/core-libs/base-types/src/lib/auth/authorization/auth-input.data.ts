export interface RegisterBaseInput {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginBaseInput {
  email: string;
  password: string;
}

export interface RefreshBaseInput {
  refreshToken: string;
}

export interface ResetPasswordBaseInput {
  email: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface ForgotPasswordBaseInput {
  email: string;
}
