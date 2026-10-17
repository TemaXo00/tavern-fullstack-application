import { Ref } from 'vue'

interface BaseAPIResponse<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
}

export interface UseAPIResponse<T> extends BaseAPIResponse<T> {
  execute: (fn: () => Promise<T>) => Promise<T | null>
  apiPath: string
}

export interface UseWithoutBODYResponse<T> extends BaseAPIResponse<T> {
  method: () => Promise<T | null>
}

export interface UseBODYMethodsResponse<T, B> extends BaseAPIResponse<T> {
  method: (body?: B) => Promise<T | null>
}
