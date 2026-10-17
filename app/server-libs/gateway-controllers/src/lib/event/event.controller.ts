import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { Roles } from '@org/enums'
import {
  DELETEProtectedMethod,
  GETMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  POSTProtected,
  PUTProtectedMethod,
  QUERYMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import {
  CreateEventDto,
  DeleteOtherEventDto,
  EventPrivatePaginationDto,
  EventPublicPaginationDto,
  SwitchEventOrganizerDto,
  UpdateEventDto,
} from '@org/gateway-dto'
import { EventGatewayMapService } from '@org/gateway-map'
import { EVENT_EVENTS_ROUTES } from '@org/routes-config'
import {
  EventMethodsSharedOutput,
  EventSharedOutput,
  PaginatedPrivateEventsSharedOutput,
  PaginatedPublicEventsSharedOutput,
} from '@org/shared-types'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { EventEventsServiceObservableContract, ValidateInput } from '@org/grpc-types'

@HTTPController({
  microserviceName: 'Event',
  serviceName: 'Event',
})
export class EventController implements OnModuleInit {
  private eventContract!: EventEventsServiceObservableContract

  constructor(
    @Inject('EVENT_CLIENT') private readonly client: ClientGrpc,
    private readonly map: EventGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.eventContract = this.client.getService<EventEventsServiceObservableContract>('EventService')
  }

  @QUERYMethod({
    path: EVENT_EVENTS_ROUTES.GET_PUBLIC_PAGINATED,
    summary: 'Get paginated public events',
    operationDesc:
      'Returns a paginated list of all public events. Only events with the PUBLISHED status are included. Supports filtering by date, available places, tags, and search query.',
  })
  async getPublicPaginated(@Body() pagination: EventPublicPaginationDto): Promise<PaginatedPublicEventsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.GetPublicEvents({ pagination }))
    return {
      pagination: response.pagination,
      events: this.map.mapEventsListOutput(response.events),
    }
  }

  @QUERYProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_PRIVATE_PAGINATED,
    summary: 'Get paginated private events',
    operationDesc:
      'Returns a paginated list of all events with any status, including DRAFT and CANCELLED. Available only to administrators.',
    roles: [Roles.ADMIN],
  })
  async getPrivatePaginated(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: EventPrivatePaginationDto,
  ): Promise<PaginatedPrivateEventsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.GetPrivateEvents({
        validation,
        pagination: this.map.mapPaginationPrivateInput(pagination),
      }),
    )
    return {
      pagination: this.map.mapPaginationPrivateOutput(response.pagination),
      events: this.map.mapEventsListOutput(response.events),
    }
  }

  @QUERYMethod({
    path: EVENT_EVENTS_ROUTES.GET_PUBLIC_BY_USER.PATH,
    summary: 'Get public events of a user',
    operationDesc:
      'Returns a paginated list of public events organized by the specified user. Only events with PUBLISHED or FINISHED status are included.',
  })
  async getPublicByUser(
    @Body() pagination: EventPublicPaginationDto,
    @Param(EVENT_EVENTS_ROUTES.GET_PUBLIC_BY_USER.PARAM) nickname: string,
  ): Promise<PaginatedPublicEventsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.GetPublicUserEvents({ pagination, nickname }))
    return {
      pagination: response.pagination,
      events: this.map.mapEventsListOutput(response.events),
    }
  }

  @QUERYProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_PRIVATE_BY_USER.PATH,
    summary: 'Get private events of a user',
    operationDesc:
      'Returns a paginated list of all events organized by the specified user, including DRAFT and CANCELLED. Available only to administrators.',
    roles: [Roles.ADMIN],
  })
  async getPrivateByUser(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: EventPrivatePaginationDto,
    @Param(EVENT_EVENTS_ROUTES.GET_PRIVATE_BY_USER.PARAM) nickname: string,
  ): Promise<PaginatedPrivateEventsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.GetPrivateUserEvents({
        validation,
        pagination: this.map.mapPaginationPrivateInput(pagination),
        nickname,
      }),
    )
    return {
      pagination: this.map.mapPaginationPrivateOutput(response.pagination),
      events: this.map.mapEventsListOutput(response.events),
    }
  }

  @QUERYProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_MY_PAGINATED,
    summary: 'Get my events',
    operationDesc:
      'Returns a paginated list of all events organized by the currently authenticated user, including DRAFT and CANCELLED.',
  })
  async getMyEvents(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: EventPrivatePaginationDto,
  ): Promise<PaginatedPrivateEventsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.GetMyEvents({
        validation,
        pagination: this.map.mapPaginationPrivateInput(pagination),
      }),
    )
    return {
      pagination: this.map.mapPaginationPrivateOutput(response.pagination),
      events: this.map.mapEventsListOutput(response.events),
    }
  }

  @GETMethod({
    path: EVENT_EVENTS_ROUTES.GET_PUBLIC_BY_SLUG.PATH,
    summary: 'Get public event by slug',
    operationDesc:
      'Returns detailed information about a public event by its slug. Only events with PUBLISHED or FINISHED status are available.',
  })
  async getPublicBySlug(@Param(EVENT_EVENTS_ROUTES.GET_PUBLIC_BY_SLUG.PARAM) slug: string): Promise<EventSharedOutput> {
    const response = await firstValueFrom(this.eventContract.GetPublicEventBySlug({ slug }))
    return this.map.mapEventOutput(response)
  }

  @GETProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_PRIVATE_BY_SLUG.PATH,
    summary: 'Get private event by slug',
    operationDesc:
      'Returns detailed information about any event by its slug, except DRAFT. Available only to administrators.',
    roles: [Roles.ADMIN],
  })
  async getPrivateBySlug(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.GET_PRIVATE_BY_SLUG.PARAM) slug: string,
  ): Promise<EventSharedOutput> {
    const response = await firstValueFrom(this.eventContract.GetPrivateEventBySlug({ validation, slug }))
    return this.map.mapEventOutput(response)
  }

  @GETProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_MY_BY_SLUG.PATH,
    summary: 'Get my event by slug',
    operationDesc:
      'Returns detailed information about an event organized by the currently authenticated user. DRAFT events are available only to the organizer.',
  })
  async getMyBySlug(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.GET_MY_BY_SLUG.PARAM) slug: string,
  ): Promise<EventSharedOutput> {
    const response = await firstValueFrom(this.eventContract.GetMyEventBySlug({ validation, slug }))
    return this.map.mapEventOutput(response)
  }

  @POSTProtected({
    path: EVENT_EVENTS_ROUTES.CREATE,
    summary: 'Create a new event',
    operationDesc:
      'Creates a new event in DRAFT status. Available to administrators and moderators. The organizer is set to the currently authenticated user.',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async create(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateEventDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.CreateEvent({ validation, ...dto }))
    return this.map.mapEventMethodsOutput(response)
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.PUBLISH.PATH,
    summary: 'Publish an event',
    operationDesc:
      'Changes the event status from DRAFT to PUBLISHED, making it visible to all users. Available only to the organizer.',
  })
  async publish(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.PUBLISH.PARAM) slug: string,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.PublishEvent({ slug, validation }))
    return this.map.mapEventMethodsOutput(response)
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.CANCEL.PATH,
    summary: 'Cancel an event',
    operationDesc:
      'Changes the event status to CANCELLED. The event remains visible but is marked as cancelled. Available only to the organizer.',
  })
  async cancel(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.CANCEL.PARAM) slug: string,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.CancelEvent({ slug, validation }))
    return this.map.mapEventMethodsOutput(response)
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.FINISH.PATH,
    summary: 'Finish an event',
    operationDesc: 'Changes the event status to FINISHED after it has taken place. Available only to the organizer.',
  })
  async finish(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.FINISH.PARAM) slug: string,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.FinishEvent({ slug, validation }))
    return this.map.mapEventMethodsOutput(response)
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.SWITCH_ORGANIZER.PATH,
    summary: 'Switch my event organizer',
    operationDesc: 'Transfers ownership of the event to another user. Using by current user',
  })
  async switchOrganizer(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.SWITCH_ORGANIZER.PARAM) slug: string,
    @Body() dto: SwitchEventOrganizerDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.SwitchOrganizer({ validation, slug, ...dto }))
    return this.map.mapEventMethodsOutput(response)
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.SWITCH_OTHER_EVENT_ORGANIZER.PATH,
    summary: 'Switch other event organizer',
    operationDesc:
      'Transfers ownership of the event to another user. Available only to administrators and their can switch organization to other user',
    roles: [Roles.ADMIN],
  })
  async switchOtherEventOrganizer(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.SWITCH_OTHER_EVENT_ORGANIZER.PARAM) slug: string,
    @Body() dto: SwitchEventOrganizerDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.SwitchOtherEventOrganizer({
        validation,
        slug,
        ...dto,
      }),
    )
    return this.map.mapEventMethodsOutput(response)
  }

  @PUTProtectedMethod({
    path: EVENT_EVENTS_ROUTES.UPDATE.PATH,
    summary: 'Update event data',
    operationDesc:
      'Updates the description, date and time, total places, or tags of the event. Available only to the organizer.',
  })
  async update(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.UPDATE.PARAM) slug: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.UpdateEvent({ validation, slug, ...dto }))
    return this.map.mapEventMethodsOutput(response)
  }

  @DELETEProtectedMethod({
    path: EVENT_EVENTS_ROUTES.DELETE.PATH,
    summary: 'Delete my event',
    operationDesc:
      'Permanently deletes the event organized by the currently authenticated user. All participants will be removed.',
  })
  async deleteMy(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.DELETE.PARAM) slug: string,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.DeleteEvent({ validation, slug }))
    return this.map.mapEventMethodsOutput(response)
  }

  @DELETEProtectedMethod({
    path: EVENT_EVENTS_ROUTES.DELETE_OTHER.PATH,
    summary: 'Delete another user event',
    operationDesc:
      'Permanently deletes an event organized by another user and sends a notification message to the organizer. Available only to administrators.',
    roles: [Roles.ADMIN],
  })
  async deleteOther(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.DELETE_OTHER.PARAM) slug: string,
    @Body() dto: DeleteOtherEventDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(this.eventContract.DeleteOtherEvent({ validation, slug, ...dto }))
    return this.map.mapEventMethodsOutput(response)
  }
}
