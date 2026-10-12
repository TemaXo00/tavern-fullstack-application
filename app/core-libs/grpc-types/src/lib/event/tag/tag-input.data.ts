import {
  CreateEventTagBaseInput,
  EventTagBySlugBaseInput,
  GetPaginatedEventTagsBaseInput,
  UpdateEventTagBaseInput,
} from '@org/base-types';

import { Protected } from '../../utils/protected.js';

export type GetPaginatedEventTagsInput = GetPaginatedEventTagsBaseInput;
export type GetEventTagInput = EventTagBySlugBaseInput;
export type CreateEventTagInput = Protected<CreateEventTagBaseInput>;
export type UpdateEventTagInput = Protected<
  EventTagBySlugBaseInput & UpdateEventTagBaseInput
>;
export type DeleteEventTagInput = Protected<EventTagBySlugBaseInput>;
