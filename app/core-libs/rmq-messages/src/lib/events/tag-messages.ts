import { UpdateEventTagBaseInput } from '@org/base-types';

export interface EventTagCreatedMessage {
  adminId: string;
  tagSlug: string;
}

export interface EventTagUpdatedMessage {
  adminId: string;
  slug: string;
  data: UpdateEventTagBaseInput;
}

export interface EventTagDeletedMessage {
  adminId: string;
  tagSlug: string;
}
