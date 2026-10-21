export enum EventStatuses {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  FINISHED = 'FINISHED',
}

export const EVENT_STATUSES_TO_GRPC: Record<EventStatuses, number> = {
  DRAFT: 0,
  PUBLISHED: 1,
  CANCELLED: 2,
  FINISHED: 3,
} as const

export const GRPC_TO_EVENT_STATUSES: Record<number, EventStatuses> = {
  0: EventStatuses.DRAFT,
  1: EventStatuses.PUBLISHED,
  2: EventStatuses.CANCELLED,
  3: EventStatuses.FINISHED,
} as const

export enum ParticipantStatuses {
  WAITLIST = 'WAITLIST',
  RECORDED = 'RECORDED',
  FIXED = 'FIXED',
  NOT_COME = 'NOT_COME',
}

export const PARTICIPANT_STATUSES_TO_GRPC: Record<ParticipantStatuses, number> = {
  WAITLIST: 0,
  RECORDED: 1,
  FIXED: 2,
  NOT_COME: 3,
}

export const GRPC_TO_PARTICIPANT_STATUSES: Record<number, ParticipantStatuses> = {
  0: ParticipantStatuses.WAITLIST,
  1: ParticipantStatuses.RECORDED,
  2: ParticipantStatuses.FIXED,
  3: ParticipantStatuses.NOT_COME,
}
