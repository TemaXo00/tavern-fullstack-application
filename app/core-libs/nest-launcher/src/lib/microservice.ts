import { join } from 'path'

import { ConsoleLogger, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { workspaceRoot } from 'nx/src/utils/workspace-root'

import { CONSOLE_LOGGER_CONFIG } from './config/console-logger.config.js'
import { setupMicroserviceEnvVariables } from './utils/env-variables.util.js'
import { logMicroserviceMessages } from './utils/log-info.util.js'

import type { MicroserviceBootstrapOptions } from './types/microservice.type.js'

export async function microservice<T>(options: MicroserviceBootstrapOptions<T>): Promise<void> {
  const APP_ENV_NAME = options.name.toUpperCase()
  const APP_LOCAL_NAME = options.name.toLowerCase()
  const APP_SCOPE = options.scope.toUpperCase()
  const LOGGER_NAME = `${APP_ENV_NAME} Microservice`
  const GRPC_PROTO_PATH = `proto/${APP_LOCAL_NAME}.proto`
  const GRPC_PROTO_PACKAGE = APP_LOCAL_NAME

  const app = await NestFactory.create(options.module, {
    logger: options.logs ? new ConsoleLogger(CONSOLE_LOGGER_CONFIG(LOGGER_NAME)) : ['error', 'warn'],
  })

  const logger = new Logger()
  const config = app.get(ConfigService)

  const env = setupMicroserviceEnvVariables(APP_SCOPE, APP_ENV_NAME, config)

  if (options.grpc) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        protoPath: join(workspaceRoot, GRPC_PROTO_PATH),
        package: GRPC_PROTO_PACKAGE,
        url: `0.0.0.0:${env.GRPC_PORT}`,
      },
    })
  }

  if (options.rabbitMQ) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${env.RMQ_USER}:${env.RMQ_PASSWORD}@${env.RMQ_URL}`],
        queue: APP_LOCAL_NAME,
        queueOptions: {
          durable: true,
        },
      },
    })
  }

  logMicroserviceMessages(options, env, logger)

  process.on('SIGTERM', async () => {
    logger.log('Received SIGTERM, shutting down...')
    await app.close()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    logger.log('Received SIGINT, shutting down...')
    await app.close()
    process.exit(0)
  })

  try {
    await app.startAllMicroservices()
    logger.log(`${LOGGER_NAME} successfully started`)
  } catch (error) {
    logger.error('Failed to start')
    logger.error(error)
    process.exit(1)
  }
}
