import { Injectable } from '@nestjs/common'
import { LogGrpcOutput } from '@org/grpc-types'
import { LogSharedOutput } from '@org/shared-types'

@Injectable()
export class LogGatewayMapService {
  private safeParse(value: string): unknown {
    try {
      return JSON.parse(value)
    } catch {
      return {}
    }
  }

  mapLogsOutput(logs: LogGrpcOutput[]): LogSharedOutput[] {
    return logs.map((log) => {
      return {
        ...log,
        logBody: this.safeParse(log.logBody),
      }
    })
  }
}
