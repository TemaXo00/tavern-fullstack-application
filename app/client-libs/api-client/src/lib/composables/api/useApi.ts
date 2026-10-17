import { Ref, ref } from 'vue'

import { extractApiError } from '../../extract-api-error.js'
import { UseAPIRequest } from '../types/api/request.type.js'
import { UseAPIResponse } from '../types/api/response.type.js'
import { parseRequest } from '../utils/parse-request.js'

export function useApi<T>(options: UseAPIRequest): UseAPIResponse<T> {
  const data: Ref<T | null> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const apiPath = options.params ? parseRequest(options.path, options.params) : options.path

  const execute = async (fn: () => Promise<T>): Promise<T | null> => {
    loading.value = true
    error.value = null

    try {
      const result = await fn()
      data.value = result
      return result
    } catch (e) {
      error.value = extractApiError(e).data
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    apiPath,
    loading,
    error,
    execute,
  }
}
