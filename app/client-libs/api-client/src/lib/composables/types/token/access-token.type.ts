import type { Ref } from 'vue'

export interface UseAccessToken {
  accessToken: Ref<string | null>
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
}
