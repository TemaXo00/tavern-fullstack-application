import { EventStatuses } from '@org/event-database'

export interface EventInTransactionOutput {
  id: string
  isJoinBlocked: boolean
  dateAndTime: Date
  leftPlaces: number
  status: EventStatuses
}
