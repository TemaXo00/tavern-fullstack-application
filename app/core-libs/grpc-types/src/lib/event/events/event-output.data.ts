import {
  EventBaseOutput,
  EventListBaseOutput,
  EventMethodsBaseOutput,
  EventPrivatePaginationBaseOutput,
  PaginatedPrivateEventsBaseOutput,
  PaginatedPublicEventsBaseOutput,
} from '@org/base-types';

export type EventPrivatePaginationGrpcOutput = EventPrivatePaginationBaseOutput;
export type EventListGrpcOutput = EventListBaseOutput;

export type EventOutput = EventBaseOutput;
export type EventMethodsOutput = EventMethodsBaseOutput;
export type PaginatedPublicEventsOutput = PaginatedPublicEventsBaseOutput;
export type PaginatedPrivateEventsOutput = PaginatedPrivateEventsBaseOutput;
