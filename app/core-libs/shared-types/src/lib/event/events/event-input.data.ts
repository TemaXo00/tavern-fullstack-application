import {
  CreateEventBaseInput,
  EventPrivatePaginationBaseInput,
  EventPublicPaginationBaseInput,
  SwitchEventOrganizerBaseInput,
  UpdateEventDataBaseInput,
} from '@org/base-types';
import { EventStatuses } from '@org/enums';

import { Replace } from '../../utils/replace.js';

export type EventPublicPaginationSharedInput = EventPublicPaginationBaseInput;
export type EventPrivatePaginationSharedInput = Replace<
  EventPrivatePaginationBaseInput,
  {
    status?: EventStatuses;
  }
>;
export type CreateEventSharedInput = CreateEventBaseInput;
export type SwitchEventOrganizerSharedInput = Omit<SwitchEventOrganizerBaseInput, 'slug'>;
export type UpdateEventDataSharedInput = Omit<UpdateEventDataBaseInput, 'slug'>;
export interface DeleteOtherEventSharedInput {
  message: string;
}
