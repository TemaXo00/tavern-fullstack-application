import { EventPrivatePaginationGrpcInput } from '@org/grpc-types'

export interface AdminCheckPrivatePaginatedMessage {
  adminId: string
  query: EventPrivatePaginationGrpcInput
}

export interface AdminCheckBySlugMessage {
  adminId: string
  eventSlug: string
}

export interface EventEventsAuthorManipulateMessages {
  organizerId: string
  eventSlug: string
}

export interface EventEventsAuthorChangeOrganizer {
  previousId: string
  newId: string
  eventSlug: string
}

export interface EventEventsAdminChangeOrganizerMessage {
  adminId: string
  previousId: string
  newId: string
  eventSlug: string
}

export interface EventEventsAdminDeleteMessage {
  adminId: string
  slug: string
  message: string
}
