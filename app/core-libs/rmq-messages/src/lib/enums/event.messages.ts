export enum EVENT_TAG_MESSAGES {
  TAG_CREATE = 'event.tag.create',
  TAG_UPDATE = 'event.tag.update',
  TAG_DELETE = 'event.tag.delete',
}

export enum EVENT_EVENTS_MESSAGES {
  AUTHOR_CREATED = 'event.events.author.created',
  AUTHOR_UPDATED = 'event.events.author.updated',
  AUTHOR_PUBLISHED = 'event.events.author.published',
  AUTHOR_CANCELLED = 'event.events.author.cancelled',
  AUTHOR_FINISHED = 'event.events.author.finished',
  AUTHOR_DELETED = 'event.events.author.deleted',
  ADMIN_CHANGE_ORGANIZER = 'event.events.admin.change-organizer',
  ADMIN_DELETE = 'event.events.admin.delete',
  ADMIN_CHECK_PRIVATE_PAGINATED = 'event.events.admin.check-private-paginated',
  ADMIN_CHECK_BY_SLUG = 'event.events.admin.check-by-slug',
}
