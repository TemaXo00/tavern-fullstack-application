import { AUTH_AUTHORIZATION_ROUTES, PROFILE_PROFILE_ROUTES } from '@org/routes-config'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { configureApiHooks } from '../api-hooks.js'
import { useGET } from '../composables/api/useGET.js'
import { usePOST } from '../composables/api/usePOST.js'
import { useAccessToken } from '../composables/token/useAccessToken.js'

import type { AuthSharedOutput, ProfileAdvancedSharedOutput, UserSharedEntity } from '@org/shared-types'

interface AuthMe {
  user: UserSharedEntity
  profile: ProfileAdvancedSharedOutput
}

const AUTH_BASE = AUTH_AUTHORIZATION_ROUTES.BASE_URL
const PROFILE_BASE = PROFILE_PROFILE_ROUTES.BASE_URL

const authPath = (...segments: (string | number)[]): string => `/${segments.join('/')}`

export const useAuthStore = defineStore('auth', () => {
  const { accessToken, setAccessToken, clearAccessToken } = useAccessToken()

  const me = ref<AuthMe | null>(null)
  const isAuthenticated = computed<boolean>(() => accessToken.value !== null)

  const refreshRequest = usePOST<AuthSharedOutput, Record<string, never>>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.REFRESH),
    skipAuthRefresh: true,
  })

  const logoutRequest = usePOST<null, Record<string, never>>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.LOGOUT),
    skipAuthRefresh: true,
  })

  const getMeRequest = useGET<UserSharedEntity>({
    path: authPath(AUTH_BASE, AUTH_AUTHORIZATION_ROUTES.GET_ME),
  })

  const getMyProfileRequest = useGET<ProfileAdvancedSharedOutput>({
    path: authPath(PROFILE_BASE, PROFILE_PROFILE_ROUTES.GET_ME),
  })

  const loading = computed<boolean>(
    () =>
      refreshRequest.loading.value ||
      logoutRequest.loading.value ||
      getMeRequest.loading.value ||
      getMyProfileRequest.loading.value,
  )

  let refreshPromise: Promise<boolean> | null = null

  const refresh = (): Promise<boolean> => {
    refreshPromise ??= (async (): Promise<boolean> => {
      try {
        await refreshRequest.method()

        const token = refreshRequest.data.value?.accessToken

        if (refreshRequest.error.value !== null || !token) {
          return false
        }

        setAccessToken(token)
        return true
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  const clearSession = (): void => {
    clearAccessToken()
    me.value = null
    initialized.value = false
  }

  const getMyProfile = async (): Promise<boolean> => {
    await Promise.all([getMeRequest.method(), getMyProfileRequest.method()])

    const user = getMeRequest.data.value
    const profile = getMyProfileRequest.data.value

    if (getMeRequest.error.value !== null || getMyProfileRequest.error.value !== null || !user || !profile) {
      return false
    }

    me.value = { user, profile }
    return true
  }

  const logout = async (): Promise<void> => {
    await logoutRequest.method()
    clearSession()
  }

  let isHandlingUnauthorized = false

  const handleUnauthorized = async (): Promise<boolean> => {
    if (isHandlingUnauthorized) {
      return refreshPromise ?? false
    }

    isHandlingUnauthorized = true

    try {
      const refreshed = await refresh()

      if (!refreshed) {
        await logout()
      }

      return refreshed
    } finally {
      isHandlingUnauthorized = false
    }
  }

  const initialized = ref(false)

  const init = async (): Promise<void> => {
    try {
      if (accessToken.value === null && !(await refresh())) {
        return
      }

      await getMyProfile()
    } finally {
      initialized.value = true
    }
  }

  configureApiHooks({
    getAccessToken: (): string | null => accessToken.value,
    onUnauthorized: (): Promise<boolean> => handleUnauthorized(),
  })

  return {
    me,
    accessToken,
    isAuthenticated,
    initialized,
    setAccessToken,
    loading,
    refresh,
    logout,
    getMyProfile,
    init,
    refreshError: refreshRequest.error,
    logoutError: logoutRequest.error,
    getMeError: getMeRequest.error,
    getMyProfileError: getMyProfileRequest.error,
  }
})
