import { EventSelect, EventUserSnapshotSelect } from '@org/event-database'

export const EVENT_TRANSACTION_SELECTION = {
  id: true,
  isJoinBlocked: true,
  dateAndTime: true,
  leftPlaces: true,
  status: true,
  organizerId: true
} as const satisfies EventSelect

export const USER_TRANSACTION_SELECTION = {
  userId: true,
  isActive: true,
} as const satisfies EventUserSnapshotSelect
