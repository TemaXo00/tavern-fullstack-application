import { Injectable } from '@nestjs/common'
import {
  EVENT_STATUSES_TO_GRPC,
  GRPC_TO_EVENT_STATUSES,
  GRPC_TO_PARTICIPANT_STATUSES,
  PARTICIPANT_STATUSES_TO_GRPC,
} from '@org/enums'
import {
  EventListGrpcOutput,
  EventOutput,
  EventPrivatePaginationGrpcInput,
  EventPrivatePaginationGrpcOutput,
  EventMethodsOutput,
  ParticipatedEventsPaginationGrpcInput,
  ParticipatedEventsPaginationGrpcOutput,
  ParticipatedEventGrpcOutput,
  EventParticipantPaginationGrpcInput,
  EventParticipantPaginationGrpcOutput,
  EventParticipantOutput,
  ChangeUserParticipantStatusGrpcInput,
} from '@org/grpc-types'
import {
  ChangeUserParticipantStatusSharedInput,
  EventListSharedOutput,
  EventMethodsSharedOutput,
  EventParticipantPaginationSharedInput,
  EventParticipantPaginationSharedOutput,
  EventParticipantSharedOutput,
  EventPrivatePaginationSharedInput,
  EventPrivatePaginationSharedOutput,
  EventSharedOutput,
  ParticipatedEventSharedOutput,
  ParticipatedEventsPaginationSharedInput,
  ParticipatedEventsPaginationSharedOutput,
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
      status: output.status !== undefined ? GRPC_TO_EVENT_STATUSES[output.status] : undefined,
    }
  }

  mapEventsListOutput(output?: EventListGrpcOutput[]): EventListSharedOutput[] {
    if (!output || !Array.isArray(output)) {
      return []
    }
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

  mapParticipatedEventsPaginationInput(
    input: ParticipatedEventsPaginationSharedInput,
  ): ParticipatedEventsPaginationGrpcInput {
    return {
      ...input,
      status: input.status ? EVENT_STATUSES_TO_GRPC[input.status] : undefined,
    }
  }

  mapParticipatedEventsPaginationOutput(
    output: ParticipatedEventsPaginationGrpcOutput,
  ): ParticipatedEventsPaginationSharedOutput {
    return {
      ...output,
      status: output.status !== undefined ? GRPC_TO_EVENT_STATUSES[output.status] : undefined,
    }
  }

  mapParticipatedEventsOutput(output: ParticipatedEventGrpcOutput[]): ParticipatedEventSharedOutput[] {
    if (!output || !Array.isArray(output)) {
      return []
    }
    return output.map((entry) => {
      return {
        ...entry,
        status: GRPC_TO_EVENT_STATUSES[entry.status],
      }
    })
  }

  mapEventParticipantsPaginationInput(
    input: EventParticipantPaginationSharedInput,
  ): EventParticipantPaginationGrpcInput {
    return {
      ...input,
      status: input.status ? PARTICIPANT_STATUSES_TO_GRPC[input.status] : undefined,
    }
  }

  mapEventParticipantsPaginationOutput(
    output: EventParticipantPaginationGrpcOutput,
  ): EventParticipantPaginationSharedOutput {
    return {
      ...output,
      status: output.status !== undefined ? GRPC_TO_PARTICIPANT_STATUSES[output.status] : undefined,
    }
  }

  mapParticipatedEventOutput(output: ParticipatedEventGrpcOutput): ParticipatedEventSharedOutput {
    return {
      ...output,
      status: GRPC_TO_EVENT_STATUSES[output.status],
    }
  }

  mapListOfEventParticipantOutput(output: EventParticipantOutput[]): EventParticipantSharedOutput[] {
    if (!output || !Array.isArray(output)) {
      return []
    }
    return output.map((entry) => {
      return {
        ...entry,
        status: GRPC_TO_PARTICIPANT_STATUSES[entry.status],
      }
    })
  }

  mapEventParticipantOutput(output: EventParticipantOutput): EventParticipantSharedOutput {
    return {
      ...output,
      status: GRPC_TO_PARTICIPANT_STATUSES[output.status],
    }
  }

  mapChangeUserStatus(input: ChangeUserParticipantStatusSharedInput): ChangeUserParticipantStatusGrpcInput {
    return {
      ...input,
      status: PARTICIPANT_STATUSES_TO_GRPC[input.status],
    }
  }
}
