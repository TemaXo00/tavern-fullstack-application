import { BaseOptions } from './shared.types.js'

export interface MicroserviceBootstrapOptions<T> extends BaseOptions<T> {
  rabbitMQ?: boolean
}
