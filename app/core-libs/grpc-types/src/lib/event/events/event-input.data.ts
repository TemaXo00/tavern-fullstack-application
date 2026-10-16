import {
  CreateEventBaseInput,
  DeleteOtherEventBaseInput,
  EventActionBaseInput,
  EventPrivatePaginationBaseInput,
  GetEventBySlugBaseInput,
  GetPrivateUserEventsBaseInput,
  GetPublicUserEventsBaseInput,
  PaginatedPrivateEventsBaseInput,
  PaginatedPublicEventsBaseInput,
  SwitchEventOrganizerBaseInput,
  UpdateEventDataBaseInput,
} from '@org/base-types';

import { Protected } from '../../utils/protected.js';

export type EventPrivatePaginationGrpcInput = EventPrivatePaginationBaseInput;

export type PaginatedPublicEventsInput = PaginatedPublicEventsBaseInput;
export type PaginatedPrivateEventsInput =
  Protected<PaginatedPrivateEventsBaseInput>;
export type GetPublicUserEventsInput = GetPublicUserEventsBaseInput;
export type GetPrivateUserEventsInput =
  Protected<GetPrivateUserEventsBaseInput>;
export type GetPublicEventBySlug = GetEventBySlugBaseInput;
export type GetPrivateEventBySlug = Protected<GetEventBySlugBaseInput>;
export type CreateEventInput = Protected<CreateEventBaseInput>;
export type PublishEventInput = Protected<EventActionBaseInput>;
export type CancelEventInput = Protected<EventActionBaseInput>;
export type FinishEventInput = Protected<EventActionBaseInput>;
export type SwitchOrganizerInput = Protected<SwitchEventOrganizerBaseInput>;
export type UpdateEventDataInput = Protected<UpdateEventDataBaseInput>;
export type DeleteEventInput = Protected<EventActionBaseInput>;
export type DeleteOtherEventInput = Protected<DeleteOtherEventBaseInput>;
