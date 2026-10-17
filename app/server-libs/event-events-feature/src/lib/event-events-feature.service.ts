import { Injectable } from '@nestjs/common'
import {
  CancelEventInput,
  CreateEventInput,
  DeleteEventInput,
  DeleteOtherEventInput,
  EventEventsServiceContract,
  EventMethodsOutput,
  EventOutput,
  FinishEventInput,
  GetPrivateEventBySlug,
  GetPrivateUserEventsInput,
  GetPublicEventBySlug,
  GetPublicUserEventsInput,
  PaginatedPrivateEventsInput,
  PaginatedPrivateEventsOutput,
  PaginatedPublicEventsInput,
  PaginatedPublicEventsOutput,
  PublishEventInput,
  SwitchOrganizerInput,
  UpdateEventDataInput,
} from '@org/grpc-types'

@Injectable()
export class EventEventsFeatureService implements EventEventsServiceContract {
  async GetPublicEvents(data: PaginatedPublicEventsInput): Promise<PaginatedPublicEventsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetPrivateEvents(data: PaginatedPrivateEventsInput): Promise<PaginatedPrivateEventsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetMyEvents(data: PaginatedPrivateEventsInput): Promise<PaginatedPrivateEventsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetPublicUserEvents(data: GetPublicUserEventsInput): Promise<PaginatedPublicEventsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetPrivateUserEvents(data: GetPrivateUserEventsInput): Promise<PaginatedPrivateEventsOutput> {
    throw new Error('Method not implemented.')
  }

  async GetPublicEventBySlug(data: GetPublicEventBySlug): Promise<EventOutput> {
    throw new Error('Method not implemented.')
  }

  async GetPrivateEventBySlug(data: GetPrivateEventBySlug): Promise<EventOutput> {
    throw new Error('Method not implemented.')
  }

  async GetMyEventBySlug(data: GetPrivateEventBySlug): Promise<EventOutput> {
    throw new Error('Method not implemented.')
  }

  async CreateEvent(data: CreateEventInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }

  async PublishEvent(data: PublishEventInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }

  async CancelEvent(data: CancelEventInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }

  async FinishEvent(data: FinishEventInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }

  async SwitchOrganizer(data: SwitchOrganizerInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }

  async SwitchOtherEventOrganizer(data: SwitchOrganizerInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }

  async UpdateEvent(data: UpdateEventDataInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }

  async DeleteEvent(data: DeleteEventInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }

  async DeleteOtherEvent(data: DeleteOtherEventInput): Promise<EventMethodsOutput> {
    throw new Error('Method not implemented.')
  }
}
