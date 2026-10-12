import { EventTagSelect } from '@org/event-database';
import { EVENT_CONFIG } from '@org/validation-config';

export const TAG_LIST_OUTPUT_SELECTION: EventTagSelect = {
  slug: true,
  name: true,
  color: true,
};

export const TAG_BASE_OUTPUT_SELECTIONS: EventTagSelect = {
  slug: true,
  name: true,
  color: true,
  description: true,
  createdAt: true,
  updatedAt: true,
};

export const TAG_ADVANCED_OUTPUT_SELECTIONS: EventTagSelect = {
  ...TAG_BASE_OUTPUT_SELECTIONS,
  events: {
    where: {
      leftPlaces: { gte: 1 },
    },
    orderBy: {
      dateAndTime: 'asc',
    },
    take: EVENT_CONFIG.TAG.AMOUNT_OF_NEAR_EVENTS,
    select: {
      id: true,
      name: true,
      dateAndTime: true,
      leftPlaces: true,
    },
  },
};
