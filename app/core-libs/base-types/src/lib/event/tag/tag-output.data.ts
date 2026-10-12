import { PaginationBaseOutput } from '../../shared/pagination.type.js';
import { EventShortBaseOutput } from '../events/event-output.data.js';

export type EventTagPaginationBaseOutput = PaginationBaseOutput;

export interface EventTagListBaseOutput {
  slug: string;
  name: string;
  color: string | null;
}

export interface EventTagBaseOutput {
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventTagDetailedBaseOutput extends EventTagBaseOutput {
  events: EventShortBaseOutput[];
}

export interface PaginatedEventTagsBaseOutput {
  pagination: EventTagPaginationBaseOutput;
  tags: EventTagListBaseOutput[];
}
