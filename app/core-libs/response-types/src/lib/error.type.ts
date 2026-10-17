export interface ErrorResponse {
  status?: string
  timestamp?: string
  path?: string
  message?: string
  error?: string
  details?: unknown
  errors?: unknown
}
