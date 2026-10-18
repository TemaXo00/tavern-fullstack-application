import {
  EventBaseOutput,
  EventListBaseOutput,
  EventMethodsBaseOutput,
  EventPrivatePaginationBaseOutput,
  EventPublicPaginationBaseOutput,
  EventUserShortBaseOutput,
  PaginatedPrivateEventsBaseOutput,
  PaginatedPublicEventsBaseOutput,
} from '@org/base-types'

export type EventUserShortGrpcOutput = EventUserShortBaseOutput
export type EventPublicPaginationGrpcOutput = EventPublicPaginationBaseOutput
export type EventPrivatePaginationGrpcOutput = EventPrivatePaginationBaseOutput
export type EventListGrpcOutput = EventListBaseOutput

export type EventOutput = EventBaseOutput
export type EventMethodsOutput = EventMethodsBaseOutput
export type PaginatedPublicEventsOutput = PaginatedPublicEventsBaseOutput
export type PaginatedPrivateEventsOutput = PaginatedPrivateEventsBaseOutput
