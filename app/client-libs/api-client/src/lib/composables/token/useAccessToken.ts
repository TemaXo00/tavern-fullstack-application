import { ref } from 'vue'

import type { UseAccessToken } from '../types/token/access-token.type.js'
import type { Ref } from 'vue'

const accessToken: Ref<string | null> = ref<string | null>(null)

export function useAccessToken(): UseAccessToken {
  const setAccessToken = (token: string): void => {
    accessToken.value = token
  }

  const clearAccessToken = (): void => {
    accessToken.value = null
  }

  return {
    accessToken,
    setAccessToken,
    clearAccessToken,
  }
}
