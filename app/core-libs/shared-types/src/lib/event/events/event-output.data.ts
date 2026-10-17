import {
  EventBaseOutput,
  EventListBaseOutput,
  EventMethodsBaseOutput,
  EventPrivatePaginationBaseOutput,
  EventPublicPaginationBaseOutput,
} from '@org/base-types';
import { EventStatuses } from '@org/enums';

import { Replace } from '../../utils/replace.js';

export type EventPublicPaginationSharedOutput = EventPublicPaginationBaseOutput;
export type EventPrivatePaginationSharedOutput = Replace<EventPrivatePaginationBaseOutput, { status?: EventStatuses }>;
export type EventListSharedOutput = Replace<EventListBaseOutput, { status: EventStatuses }>;
export type EventSharedOutput = Replace<EventBaseOutput, { status: EventStatuses }>;
export type EventMethodsSharedOutput = Replace<EventMethodsBaseOutput, { status: EventStatuses }>;

export interface PaginatedPublicEventsSharedOutput {
  pagination: EventPublicPaginationSharedOutput;
  events: EventListSharedOutput[];
}

export interface PaginatedPrivateEventsSharedOutput {
  pagination: EventPrivatePaginationSharedOutput;
  events: EventListSharedOutput[];
}
