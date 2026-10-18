import { EventEventsDatabaseUtil } from './database.util'
import { EventEventsMessagesUtil } from './messages.util'
import { EventEventsValidationUtil } from './validation.util'

export const EVENTS_UTILS = [EventEventsDatabaseUtil, EventEventsValidationUtil, EventEventsMessagesUtil]
