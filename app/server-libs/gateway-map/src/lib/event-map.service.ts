import { Injectable } from '@nestjs/common'
import { EVENT_STATUSES_TO_GRPC, GRPC_TO_EVENT_STATUSES } from '@org/enums'
import {
  EventListGrpcOutput,
  EventOutput,
  EventPrivatePaginationGrpcInput,
  EventPrivatePaginationGrpcOutput,
  EventMethodsOutput,
} from '@org/grpc-types'
import {
  EventListSharedOutput,
  EventMethodsSharedOutput,
  EventPrivatePaginationSharedInput,
  EventPrivatePaginationSharedOutput,
  EventSharedOutput,
} from '@org/shared-types'

@Injectable()
export class EventGatewayMapService {
  mapPaginationPrivateInput(input: EventPrivatePaginationSharedInput): EventPrivatePaginationGrpcInput {
    return {
      ...input,
      status: input.status ? EVENT_STATUSES_TO_GRPC[input.status] : undefined,
    }
  }

  mapPaginationPrivateOutput(output: EventPrivatePaginationGrpcOutput): EventPrivatePaginationSharedOutput {
    return {
      ...output,
      status: output.status ? GRPC_TO_EVENT_STATUSES[output.status] : undefined,
    }
  }

  mapEventsListOutput(output: EventListGrpcOutput[]): EventListSharedOutput[] {
    return output.map((entry) => {
      return {
        ...entry,
        status: GRPC_TO_EVENT_STATUSES[entry.status],
      }
    })
  }

  mapEventOutput(output: EventOutput): EventSharedOutput {
    return {
      ...output,
      status: GRPC_TO_EVENT_STATUSES[output.status],
    }
  }

  mapEventMethodsOutput(output: EventMethodsOutput): EventMethodsSharedOutput {
    return {
      ...output,
      status: GRPC_TO_EVENT_STATUSES[output.status],
    }
  }
}
