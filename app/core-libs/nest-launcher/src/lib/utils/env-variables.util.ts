import { ConfigService } from '@nestjs/config'

import type { MicroserviceEnvVariablesResponse, MonolithEnvVariablesResponse } from '../types/utils.type.js'

export function setupMonolithEnvVariables(
  APP_SCOPE: string,
  APP_NAME: string,
  config: ConfigService,
): MonolithEnvVariablesResponse {
  const IS_DEV = config.get<string>(`${APP_SCOPE}_DEV_MODE`, 'false') === 'true'
  const APP_PORT = config.get<number>(`${APP_SCOPE}_${APP_NAME}_HTTP_PORT`, 3000)
  const WINDOW_MS = config.get<number>(`${APP_SCOPE}_${APP_NAME}_WINDOW_MS_MINUTES`, 15)
  const REQUEST_LIMIT = config.get<number>(`${APP_SCOPE}_${APP_NAME}_REQUEST_LIMIT`, 1000)
  const CORS_ORIGINS = config.get<string>(`${APP_SCOPE}_${APP_NAME}_CORS_ORIGINS`, 'example.com,test.com').split(',')

  return {
    IS_DEV,
    APP_PORT,
    WINDOW_MS,
    REQUEST_LIMIT,
    CORS_ORIGINS,
  }
}

export function setupMicroserviceEnvVariables(
  APP_SCOPE: string,
  APP_NAME: string,
  config: ConfigService,
): MicroserviceEnvVariablesResponse {
  const IS_DEV = config.get<string>(`${APP_SCOPE}_DEV_MODE`, 'false') === 'true'

  const GRPC_PORT = config.get<number>(`${APP_SCOPE}_${APP_NAME}_GRPC_PORT`, 5000)

  const RMQ_URL = config.get<string>(`${APP_SCOPE}_RMQ_URL`, 'rabbitmq:5672')
  const RMQ_USER = config.get<string>(`${APP_SCOPE}_RMQ_USER`, 'user')
  const RMQ_PASSWORD = config.get<string>(`${APP_SCOPE}_RMQ_PASSWORD`, '123456')

  return {
    IS_DEV,
    GRPC_PORT,
    RMQ_URL,
    RMQ_USER,
    RMQ_PASSWORD,
  }
}
