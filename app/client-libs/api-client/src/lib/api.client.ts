import { ofetch } from 'ofetch'

import { getApiHooks } from './api-hooks.js'
import { ResponseType } from './types/response.type.js'
import { isFetchError } from './utils/is-fetch-error.js'

import type { FetchOptions } from 'ofetch'

export const API_URL = '/api'

export interface RequestOptions extends FetchOptions<'json'> {
  skipAuthRefresh?: boolean
}

export const apiConfig = ofetch.create({
  baseURL: API_URL,
  credentials: 'include',
  timeout: 10000,
  responseType: 'json',
  retry: 3,
  retryStatusCodes: [500, 502, 503, 504],
  retryDelay: 2000,

  onRequest({ options }) {
    const accessToken = getApiHooks().getAccessToken?.()

    if (accessToken) {
      options.headers.set('Authorization', `Bearer ${accessToken}`)
    }
  },

  onResponse({ response }) {
    if (response.status >= 200 && response.status < 300) {
      const body = response._data as ResponseType<unknown>
      response._data = body.data
    }
  },
})

const isUnauthorized = (error: unknown): boolean => isFetchError(error) && error.response?.status === 401

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuthRefresh, ...fetchOptions } = options

  try {
    return await apiConfig<T>(path, fetchOptions)
  } catch (error) {
    if (skipAuthRefresh || !isUnauthorized(error)) {
      throw error
    }

    const { onUnauthorized } = getApiHooks()

    if (!onUnauthorized || !(await onUnauthorized(error))) {
      throw error
    }

    return await apiConfig<T>(path, fetchOptions)
  }
}
