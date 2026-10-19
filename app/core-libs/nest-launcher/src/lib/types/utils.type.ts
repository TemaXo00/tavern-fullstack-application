export interface MonolithEnvVariablesResponse {
  IS_DEV: boolean
  APP_PORT: number
  WINDOW_MS: number
  REQUEST_LIMIT: number
  CORS_ORIGINS: string[]
}

export interface MicroserviceEnvVariablesResponse {
  IS_DEV: boolean
  GRPC_PORT: number
  RMQ_URL: string
  RMQ_USER: string
  RMQ_PASSWORD: string
}
