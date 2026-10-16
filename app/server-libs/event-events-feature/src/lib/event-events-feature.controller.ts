import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { EventEventsFeatureService } from './event-events-feature.service';

import type {
  CancelEventInput,
  CreateEventInput,
  DeleteEventInput,
  DeleteOtherEventInput,
  Empty,
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
} from '@org/grpc-types';

@Controller()
export class EventEventsFeatureController implements EventEventsServiceContract {
  constructor(private readonly service: EventEventsFeatureService) {}

  @GrpcMethod('EventService', 'GetPublicEvents')
  async GetPublicEvents(
    data: PaginatedPublicEventsInput,
  ): Promise<PaginatedPublicEventsOutput> {
    return await this.service.GetPublicEvents(data);
  }

  @GrpcMethod('EventService', 'GetPrivateEvents')
  async GetPrivateEvents(
    data: PaginatedPrivateEventsInput,
  ): Promise<PaginatedPrivateEventsOutput> {
    return await this.service.GetPrivateEvents(data);
  }

  @GrpcMethod('EventService', 'GetMyEvents')
  async GetMyEvents(
    data: PaginatedPrivateEventsInput,
  ): Promise<PaginatedPrivateEventsOutput> {
    return await this.service.GetMyEvents(data);
  }

  @GrpcMethod('EventService', 'GetPublicUserEvents')
  async GetPublicUserEvents(
    data: GetPublicUserEventsInput,
  ): Promise<PaginatedPublicEventsOutput> {
    return await this.service.GetPublicUserEvents(data);
  }

  @GrpcMethod('EventService', 'GetPrivateUserEvents')
  async GetPrivateUserEvents(
    data: GetPrivateUserEventsInput,
  ): Promise<PaginatedPrivateEventsOutput> {
    return await this.service.GetPrivateUserEvents(data);
  }

  @GrpcMethod('EventService', 'GetPublicEventBySlug')
  async GetPublicEventBySlug(data: GetPublicEventBySlug): Promise<EventOutput> {
    return await this.service.GetPublicEventBySlug(data);
  }

  @GrpcMethod('EventService', 'GetPrivateEventBySlug')
  async GetPrivateEventBySlug(
    data: GetPrivateEventBySlug,
  ): Promise<EventOutput> {
    return await this.service.GetPrivateEventBySlug(data);
  }

  @GrpcMethod('EventService', 'GetMyEventBySlug')
  async GetMyEventBySlug(data: GetPrivateEventBySlug): Promise<EventOutput> {
    return await this.service.GetMyEventBySlug(data);
  }

  @GrpcMethod('EventService', 'CreateEvent')
  async CreateEvent(data: CreateEventInput): Promise<EventMethodsOutput> {
    return await this.service.CreateEvent(data);
  }

  @GrpcMethod('EventService', 'PublishEvent')
  async PublishEvent(data: PublishEventInput): Promise<EventMethodsOutput> {
    return await this.service.PublishEvent(data);
  }

  @GrpcMethod('EventService', 'CancelEvent')
  async CancelEvent(data: CancelEventInput): Promise<EventMethodsOutput> {
    return await this.service.CancelEvent(data);
  }

  @GrpcMethod('EventService', 'FinishEvent')
  async FinishEvent(data: FinishEventInput): Promise<EventMethodsOutput> {
    return await this.service.FinishEvent(data);
  }

  @GrpcMethod('EventService', 'SwitchOrganizer')
  async SwitchOrganizer(
    data: SwitchOrganizerInput,
  ): Promise<EventMethodsOutput> {
    return await this.service.SwitchOrganizer(data);
  }

  @GrpcMethod('EventService', 'UpdateEvent')
  async UpdateEvent(data: UpdateEventDataInput): Promise<EventMethodsOutput> {
    return await this.service.UpdateEvent(data);
  }

  @GrpcMethod('EventService', 'DeleteEvent')
  async DeleteEvent(data: DeleteEventInput): Promise<Empty> {
    return await this.service.DeleteEvent(data);
  }

  @GrpcMethod('EventService', 'DeleteOtherEvent')
  async DeleteOtherEvent(data: DeleteOtherEventInput): Promise<Empty> {
    return await this.service.DeleteOtherEvent(data);
  }
}
