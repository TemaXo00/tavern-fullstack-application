import {
  AUTH_AUTHORIZATION_ROUTES,
  PROFILE_PROFILE_ROUTES,
} from '@org/routes-config';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { configureApiHooks } from '../api-hooks.js';
import { useGET } from '../composables/api/useGET.js';
import { usePOST } from '../composables/api/usePOST.js';
import { useAccessToken } from '../composables/token/useAccessToken.js';

import type {
  AuthSharedOutput,
  ForgotPasswordSharedInput,
  LoginSharedInput,
  ProfileAdvancedSharedOutput,
  RegisterSharedInput,
  ResetPasswordSharedInput,
  UserSharedEntity,
} from '@org/shared-types';

interface AuthMe {
  user: UserSharedEntity;
  profile: ProfileAdvancedSharedOutput;
}

const AUTH_BASE = AUTH_AUTHORIZATION_ROUTES.BASE_URL;
const PROFILE_BASE = PROFILE_PROFILE_ROUTES.BASE_URL;

const authPath = (...segments: (string | number)[]): string =>
  `/${segments.join('/')}`;

export const useAuthStore = defineStore('auth', () => {
  const { accessToken, setAccessToken, clearAccessToken } = useAccessToken();

  const me = ref<AuthMe | null>(null);
  const isAuthenticated = computed<boolean>(() => accessToken.value !== null);

  const loginRequest = usePOST<AuthSharedOutput, LoginSharedInput>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.LOGIN),
    skipAuthRefresh: true,
  });

  const registerRequest = usePOST<AuthSharedOutput, RegisterSharedInput>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.REGISTER),
    skipAuthRefresh: true,
  });

  const refreshRequest = usePOST<AuthSharedOutput, Record<string, never>>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.REFRESH),
    skipAuthRefresh: true,
  });

  const logoutRequest = usePOST<null, Record<string, never>>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.LOGOUT),
    skipAuthRefresh: true,
  });

  const forgotPasswordRequest = usePOST<null, ForgotPasswordSharedInput>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.FORGOT_PASSWORD),
    skipAuthRefresh: true,
  });

  const getMeRequest = useGET<UserSharedEntity>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.GET_ME),
  });

  const getMyProfileRequest = useGET<ProfileAdvancedSharedOutput>({
    path: authPath(PROFILE_BASE, PROFILE_PROFILE_ROUTES.GET_ME),
  });

  const loading = computed<boolean>(
    () =>
      loginRequest.loading.value ||
      registerRequest.loading.value ||
      refreshRequest.loading.value ||
      logoutRequest.loading.value ||
      forgotPasswordRequest.loading.value ||
      getMeRequest.loading.value ||
      getMyProfileRequest.loading.value,
  );

  const applyAccessToken = (
    data: AuthSharedOutput | null,
    error: string | null,
  ): boolean => {
    const token = data?.accessToken;

    if (error !== null || !token) {
      return false;
    }

    setAccessToken(token);
    return true;
  };

  let refreshPromise: Promise<boolean> | null = null;

  const refresh = (): Promise<boolean> => {
    refreshPromise ??= (async (): Promise<boolean> => {
      try {
        await refreshRequest.method();
        return applyAccessToken(
          refreshRequest.data.value,
          refreshRequest.error.value,
        );
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  const clearSession = (): void => {
    clearAccessToken();
    me.value = null;
  };

  const getMyProfile = async (): Promise<boolean> => {
    await Promise.all([getMeRequest.method(), getMyProfileRequest.method()]);

    const user = getMeRequest.data.value;
    const profile = getMyProfileRequest.data.value;

    if (
      getMeRequest.error.value !== null ||
      getMyProfileRequest.error.value !== null ||
      !user ||
      !profile
    ) {
      return false;
    }

    me.value = { user, profile };
    return true;
  };

  const login = async (input: LoginSharedInput): Promise<boolean> => {
    await loginRequest.method(input);

    if (!applyAccessToken(loginRequest.data.value, loginRequest.error.value)) {
      return false;
    }

    return getMyProfile();
  };

  const register = async (input: RegisterSharedInput): Promise<boolean> => {
    await registerRequest.method(input);

    if (
      !applyAccessToken(registerRequest.data.value, registerRequest.error.value)
    ) {
      return false;
    }

    return getMyProfile();
  };

  const logout = async (): Promise<void> => {
    await logoutRequest.method();
    clearSession();
  };

  const forgotPassword = async (
    input: ForgotPasswordSharedInput,
  ): Promise<boolean> => {
    await forgotPasswordRequest.method(input);
    return forgotPasswordRequest.error.value === null;
  };

  const resetPassword = async (
    token: string,
    input: ResetPasswordSharedInput,
  ): Promise<boolean> => {
    const resetRequest = usePOST<null, ResetPasswordSharedInput>({
      path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.RESET_PASSWORD.PATH),
      params: { [AUTH_AUTHORIZATION_ROUTES.RESET_PASSWORD.PARAM]: token },
      skipAuthRefresh: true,
    });

    await resetRequest.method(input);
    return resetRequest.error.value === null;
  };

  let isHandlingUnauthorized = false;

  const handleUnauthorized = async (): Promise<boolean> => {
    if (isHandlingUnauthorized) {
      return refreshPromise ?? false;
    }

    isHandlingUnauthorized = true;

    try {
      const refreshed = await refresh();

      if (!refreshed) {
        await logout();
      }

      return refreshed;
    } finally {
      isHandlingUnauthorized = false;
    }
  };

  const initialized = ref(false);

  const init = async (): Promise<void> => {
    try {
      if (accessToken.value === null && !(await refresh())) {
        return;
      }

      await getMyProfile();
    } finally {
      initialized.value = true;
    }
  };

  configureApiHooks({
    getAccessToken: (): string | null => accessToken.value,
    onUnauthorized: (): Promise<boolean> => handleUnauthorized(),
  });

  return {
    me,
    accessToken,
    isAuthenticated,
    initialized,
    loading,
    login,
    register,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    getMyProfile,
    init,
    loginError: loginRequest.error,
    registerError: registerRequest.error,
    refreshError: refreshRequest.error,
    logoutError: logoutRequest.error,
    forgotPasswordError: forgotPasswordRequest.error,
    getMeError: getMeRequest.error,
    getMyProfileError: getMyProfileRequest.error,
  };
});
