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
