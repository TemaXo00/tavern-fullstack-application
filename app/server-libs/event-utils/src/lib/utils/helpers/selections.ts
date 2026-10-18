import { EventSelect, EventTagSelect } from '@org/event-database'
import { EVENT_CONFIG } from '@org/validation-config'

export const TAG_LIST_OUTPUT_SELECTION: EventTagSelect = {
  slug: true,
  name: true,
  color: true,
}

export const TAG_BASE_OUTPUT_SELECTIONS: EventTagSelect = {
  slug: true,
  name: true,
  color: true,
  description: true,
  createdAt: true,
  updatedAt: true,
}

export const TAG_ADVANCED_OUTPUT_SELECTIONS: EventTagSelect = {
  ...TAG_BASE_OUTPUT_SELECTIONS,
  events: {
    where: {
      leftPlaces: { gte: 1 },
      status: 'PUBLISHED',
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
}

export const EVENT_LIST_SELECTIONS: EventSelect = {
  slug: true,
  name: true,
  dateAndTime: true,
  leftPlaces: true,
  waitingUsers: true,
  status: true,
  organizer: {
    select: {
      nickname: true,
      avatarId: true,
    },
  },
  tags: {
    select: {
      slug: true,
      name: true,
      color: true,
    },
  },
}

export const EVENT_OUTPUT_SELECTIONS = {
  slug: true,
  name: true,
  description: true,
  dateAndTime: true,
  totalPlaces: true,
  leftPlaces: true,
  waitingUsers: true,
  status: true,
  tags: {
    select: {
      slug: true,
      name: true,
      color: true,
    },
  },
  organizer: {
    select: {
      nickname: true,
      avatarId: true,
    },
  },
  participants: {
    select: {
      user: {
        select: {
          nickname: true,
          avatarId: true,
        },
      },
    },
  },
  createdAt: true,
} as const satisfies EventSelect

export const EVENT_METHODS_SELECTIONS = {
  slug: true,
  name: true,
  description: true,
  dateAndTime: true,
  totalPlaces: true,
  leftPlaces: true,
  waitingUsers: true,
  status: true,
  organizerId: true,
} as const satisfies EventSelect
