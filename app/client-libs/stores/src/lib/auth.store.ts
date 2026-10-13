import { useAccessToken, useGET, usePOST } from '@org/composables';
import {
  AUTH_AUTHORIZATION_ROUTES,
  PROFILE_PROFILE_ROUTES,
} from '@org/routes-config';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import type {
  AuthSharedOutput,
  ProfileAdvancedSharedOutput,
  UserSharedEntity,
} from '@org/shared-types';

export const useAuthStore = defineStore('auth', () => {
  const { accessToken, setInLocal, loadFromLocal, delFromLocal } =
    useAccessToken();

  const me = ref<{
    user: UserSharedEntity;
    profile: ProfileAdvancedSharedOutput;
  } | null>(null);

  const {
    data: refreshData,
    error: refreshError,
    method: refreshMethod,
  } = usePOST<AuthSharedOutput, Record<string, never>>({
    path: `/${AUTH_AUTHORIZATION_ROUTES.BASE_URL}/${AUTH_AUTHORIZATION_ROUTES.REFRESH}`,
  });

  const { error: logoutError, method: logoutMethod } = usePOST<
    Record<string, never>,
    Record<string, never>
  >({
    path: `/${AUTH_AUTHORIZATION_ROUTES.BASE_URL}/${AUTH_AUTHORIZATION_ROUTES.LOGOUT}`,
  });

  const {
    error: getMeError,
    method: getMeMethod,
    data: getMeData,
  } = useGET<UserSharedEntity>({
    path: `/${AUTH_AUTHORIZATION_ROUTES.BASE_URL}/${AUTH_AUTHORIZATION_ROUTES.GET_ME}`,
  });

  const {
    error: getMyProfileError,
    method: getMyProfileMethod,
    data: getMyProfileData,
  } = useGET<ProfileAdvancedSharedOutput>({
    path: `/${PROFILE_PROFILE_ROUTES.BASE_URL}/${PROFILE_PROFILE_ROUTES.GET_ME}`,
  });

  const refresh = async (): Promise<void> => {
    await refreshMethod();

    if (refreshData.value?.accessToken) {
      setInLocal(refreshData.value.accessToken);
    }
  };

  const logout = async (): Promise<void> => {
    await logoutMethod();
    delFromLocal();
  };

  const getMyProfile = async (): Promise<void> => {
    await Promise.all([getMeMethod(), getMyProfileMethod()]);
    if (getMeData.value !== null && getMyProfileData.value !== null) {
      me.value = { user: getMeData.value, profile: getMyProfileData.value };
    }
  };

  const init = async (): Promise<void> => {
    loadFromLocal();

    if (accessToken.value === null) {
      await refresh();
    }

    if (refreshError.value) {
      await logout();
      return;
    }

    await getMyProfile();
  };

  return {
    me,
    accessToken,
    refresh,
    logout,
    init,
    refreshError,
    logoutError,
    getMeError,
    getMyProfileError,
  };
});
