export enum EVENT_TAG_MESSAGES {
  TAG_CREATE = 'event.tag.create',
  TAG_UPDATE = 'event.tag.update',
  TAG_DELETE = 'event.tag.delete',
}

export enum EVENT_EVENTS_MESSAGES {
  AUTHOR_CREATED = 'event.created',
  AUTHOR_UPDATED = 'event.updated',
  AUTHOR_PUBLISHED = 'event.published',
  AUTHOR_CANCELLED = 'event.cancelled',
  AUTHOR_FINISHED = 'event.finished',
  AUTHOR_CHANGE_JOIN = 'event.join',
  AUTHOR_DELETED = 'event.deleted',
  AUTHOR_ORGANIZER = 'event.organizer',
  ADMIN_CHANGE_ORGANIZER = 'event.admin.organizer',
  ADMIN_DELETE = 'event.admin.delete',
  ADMIN_CHECK_PRIVATE_PAGINATED = 'event.admin.check',
  ADMIN_CHECK_BY_SLUG = 'event.admin.check.slug',
}

export enum EVENT_PARTICIPANT_MESSAGES {
  JOIN_EVENT = 'participant.join',
  LEAVE_EVENT = 'participant.leave',
  EVENT_ADD = 'participant.organizer.add',
  EVENT_DELETE = 'participant.organizer.delete',
  EVENT_CHANGE_STATUS = 'participant.organizer.status'
}
