import { PaginationBaseOutput } from '../../shared/pagination.type.js';
import { EventShortBaseOutput } from '../events/event-output.data.js';

export type EventTagPaginationBaseOutput = PaginationBaseOutput;

export interface TagListBaseOutput {
  slug: string;
  name: string;
  color: string | null;
}

export interface TagBaseOutput {
  slug: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagDetailedBaseOutput extends TagBaseOutput {
  events: EventShortBaseOutput;
}

export interface PaginatedTagsBaseOutput {
  pagination: EventTagPaginationBaseOutput;
  tags: TagListBaseOutput;
}
