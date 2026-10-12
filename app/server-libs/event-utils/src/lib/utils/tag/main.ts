import { EventTagCacheUtil } from './cache.util';
import { EventTagDatabaseUtil } from './database.util';
import { EventTagMessagesUtil } from './messages.util';
import { EventTagValidateUtil } from './validate.util';

export const TAG_UTILS = [
  EventTagDatabaseUtil,
  EventTagValidateUtil,
  EventTagCacheUtil,
  EventTagMessagesUtil,
];
