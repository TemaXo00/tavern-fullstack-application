import { ToObservable } from '../utils/to-observable.js';
import {
  CreateEventTagInput,
  DeleteEventTagInput,
  GetEventTagInput,
  GetPaginatedEventTagsInput,
  UpdateEventTagInput,
} from './tag/tag-input.data.js';
import {
  EventTagDetailedOutput,
  EventTagOutput,
  PaginatedEventTagsOutput,
} from './tag/tag-output.data.js';

export interface EventTagServiceContract {
  GetPaginatedTags(
    data: GetPaginatedEventTagsInput,
  ): Promise<PaginatedEventTagsOutput>;
  GetTagBySlug(data: GetEventTagInput): Promise<EventTagDetailedOutput>;
  CreateTag(data: CreateEventTagInput): Promise<EventTagOutput>;
  UpdateTag(data: UpdateEventTagInput): Promise<EventTagOutput>;
  DeleteTag(data: DeleteEventTagInput): Promise<void>;
}

export type EventTagServiceObservableContract =
  ToObservable<EventTagServiceContract>;
