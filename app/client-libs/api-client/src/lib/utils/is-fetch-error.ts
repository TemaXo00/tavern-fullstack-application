import { FetchError } from 'ofetch'

export const isFetchError = (error: unknown): error is FetchError => {
  return error !== null && typeof error === 'object' && 'response' in error && 'message' in error
}
