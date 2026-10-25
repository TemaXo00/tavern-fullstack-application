import { EventParticipantSelect, EventSelect, EventTagSelect, EventUserSnapshotSelect } from '@org/event-database'
import { EVENT_CONFIG } from '@org/validation-config'

export const TAG_LIST_OUTPUT_SELECTION = {
  slug: true,
  name: true,
  color: true,
} as const satisfies EventTagSelect

export const TAG_BASE_OUTPUT_SELECTIONS = {
  slug: true,
  name: true,
  color: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies EventTagSelect

export const TAG_ADVANCED_OUTPUT_SELECTIONS = {
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
} as const satisfies EventTagSelect

export const EVENT_LIST_SELECTIONS = {
  slug: true,
  name: true,
  dateAndTime: true,
  leftPlaces: true,
  waitingUsers: true,
  isJoinBlocked: true,
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
} as const satisfies EventSelect

export const EVENT_OUTPUT_SELECTIONS = {
  slug: true,
  name: true,
  description: true,
  dateAndTime: true,
  totalPlaces: true,
  leftPlaces: true,
  waitingUsers: true,
  isJoinBlocked: true,
  status: true,
  tags: {
    select: {
      slug: true,
      name: true,
      color: true,
    },
  },
  organizerId: true,
  organizer: {
    select: {
      nickname: true,
      avatarId: true,
    },
  },
  participants: {
    take: 5,
    where: {
      status: 'RECORDED',
    },
    orderBy: {
      createdAt: 'desc',
    },
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
  isJoinBlocked: true,
  status: true,
  organizerId: true,
} as const satisfies EventSelect

export const PARTICIPANT_IN_PAGINATION_SELECTIONS = {
  nickname: true,
  userId: true,
  avatarId: true,
} as const satisfies EventUserSnapshotSelect

export const PARTICIPATED_EVENTS_LIST_SELECTIONS = {
  slug: true,
  name: true,
  dateAndTime: true,
  status: true,
} as const satisfies EventSelect

export const PARTICIPANT_OUTPUT_SELECTIONS = {
  user: {
    select: {
      nickname: true,
      avatarId: true,
    },
  },
  eventId: true,
  isFixed: true,
  note: true,
  status: true,
} as const satisfies EventParticipantSelect
