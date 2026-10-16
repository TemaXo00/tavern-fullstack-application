import { Body, Inject, OnModuleInit, Param } from '@nestjs/common';
import { Roles } from '@org/enums';
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
} from '@org/gateway-decorators';
import {
  CreateEventDto,
  DeleteOtherEventDto,
  EventPrivatePaginationDto,
  EventPublicPaginationDto,
  SwitchEventOrganizerDto,
  UpdateEventDto,
} from '@org/gateway-dto';
import { EventGatewayMapService } from '@org/gateway-map';
import { EVENT_EVENTS_ROUTES } from '@org/routes-config';
import {
  EventMethodsSharedOutput,
  EventSharedOutput,
  PaginatedPrivateEventsSharedOutput,
  PaginatedPublicEventsSharedOutput,
} from '@org/shared-types';
import { firstValueFrom } from 'rxjs';

import type { ClientGrpc } from '@nestjs/microservices';
import type {
  EventEventsServiceObservableContract,
  ValidateInput,
} from '@org/grpc-types';

@HTTPController({
  microserviceName: 'Event',
  serviceName: 'Event',
})
export class EventController implements OnModuleInit {
  private eventContract!: EventEventsServiceObservableContract;

  constructor(
    @Inject('EVENT_CLIENT') private readonly client: ClientGrpc,
    private readonly map: EventGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.eventContract =
      this.client.getService<EventEventsServiceObservableContract>(
        'EventService',
      );
  }

  @QUERYMethod({
    path: EVENT_EVENTS_ROUTES.GET_PUBLIC_PAGINATED,
    operationDesc: 'Get paginated all public events',
  })
  async getPublicPaginated(
    @Body() pagination: EventPublicPaginationDto,
  ): Promise<PaginatedPublicEventsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.GetPublicEvents({ pagination }),
    );
    return {
      pagination: response.pagination,
      events: this.map.mapEventsListOutput(response.events),
    };
  }

  @QUERYProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_PRIVATE_PAGINATED,
    operationDesc: 'Get paginated all private events. Admin route',
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
    );
    return {
      pagination: this.map.mapPaginationPrivateOutput(response.pagination),
      events: this.map.mapEventsListOutput(response.events),
    };
  }

  @QUERYMethod({
    path: EVENT_EVENTS_ROUTES.GET_PUBLIC_BY_USER.PATH,
    operationDesc: 'Get paginated public events by user',
  })
  async getPublicByUser(
    @Body() pagination: EventPublicPaginationDto,
    @Param(EVENT_EVENTS_ROUTES.GET_PUBLIC_BY_USER.PARAM) nickname: string,
  ): Promise<PaginatedPublicEventsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.GetPublicUserEvents({ pagination, nickname }),
    );
    return {
      pagination: response.pagination,
      events: this.map.mapEventsListOutput(response.events),
    };
  }

  @QUERYProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_PRIVATE_BY_USER.PATH,
    operationDesc: 'Get paginated private events by user. Admin route',
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
    );
    return {
      pagination: this.map.mapPaginationPrivateOutput(response.pagination),
      events: this.map.mapEventsListOutput(response.events),
    };
  }

  @QUERYProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_MY_PAGINATED,
    operationDesc: 'Get my paginated events',
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
    );
    return {
      pagination: this.map.mapPaginationPrivateOutput(response.pagination),
      events: this.map.mapEventsListOutput(response.events),
    };
  }

  @GETMethod({
    path: EVENT_EVENTS_ROUTES.GET_PUBLIC_BY_SLUG.PATH,
    operationDesc: 'Get public event by slug',
  })
  async getPublicBySlug(
    @Param(EVENT_EVENTS_ROUTES.GET_PUBLIC_BY_SLUG.PARAM) slug: string,
  ): Promise<EventSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.GetPublicEventBySlug({ slug }),
    );
    return this.map.mapEventOutput(response);
  }

  @GETProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_PRIVATE_BY_SLUG.PATH,
    operationDesc: 'Get private event by slug. Admin route',
    roles: [Roles.ADMIN],
  })
  async getPrivateBySlug(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.GET_PRIVATE_BY_SLUG.PARAM) slug: string,
  ): Promise<EventSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.GetPrivateEventBySlug({ validation, slug }),
    );
    return this.map.mapEventOutput(response);
  }

  @GETProtectedMethod({
    path: EVENT_EVENTS_ROUTES.GET_MY_BY_SLUG.PATH,
    operationDesc: 'Get my event by slug',
  })
  async getMyBySlug(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.GET_MY_BY_SLUG.PARAM) slug: string,
  ): Promise<EventSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.GetMyEventBySlug({ validation, slug }),
    );
    return this.map.mapEventOutput(response);
  }

  @POSTProtected({
    path: EVENT_EVENTS_ROUTES.CREATE,
    operationDesc: 'Create event. Can only admin or moderator',
    roles: [Roles.ADMIN, Roles.MODERATOR],
  })
  async create(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateEventDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.CreateEvent({ validation, ...dto }),
    );
    return this.map.mapEventMethodsOutput(response);
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.PUBLISH.PATH,
    operationDesc: 'Publish event. Can only current user',
  })
  async publish(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.PUBLISH.PARAM) slug: string,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.PublishEvent({ slug, validation }),
    );
    return this.map.mapEventMethodsOutput(response);
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.CANCEL.PATH,
    operationDesc: 'Cancel event. Can only current user',
  })
  async cancel(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.CANCEL.PARAM) slug: string,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.CancelEvent({ slug, validation }),
    );
    return this.map.mapEventMethodsOutput(response);
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.FINISH.PATH,
    operationDesc: 'Finish event. Can only current user',
  })
  async finish(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.FINISH.PARAM) slug: string,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.FinishEvent({ slug, validation }),
    );
    return this.map.mapEventMethodsOutput(response);
  }

  @PATCHProtectedMethod({
    path: EVENT_EVENTS_ROUTES.SWITCH_ORGANIZER.PATH,
    operationDesc: 'Switch organizer. Can only admin',
    roles: [Roles.ADMIN],
  })
  async switchOrganizer(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.SWITCH_ORGANIZER.PARAM) slug: string,
    @Body() dto: SwitchEventOrganizerDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.SwitchOrganizer({ validation, slug, ...dto }),
    );
    return this.map.mapEventMethodsOutput(response);
  }

  @PUTProtectedMethod({
    path: EVENT_EVENTS_ROUTES.UPDATE.PATH,
    operationDesc: 'Update event data. Can only current user',
  })
  async update(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.UPDATE.PARAM) slug: string,
    @Body() dto: UpdateEventDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.UpdateEvent({ validation, slug, ...dto }),
    );
    return this.map.mapEventMethodsOutput(response);
  }

  @DELETEProtectedMethod({
    path: EVENT_EVENTS_ROUTES.DELETE.PATH,
    operationDesc: 'Delete my event by slug',
  })
  async deleteMy(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.DELETE.PARAM) slug: string,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.DeleteEvent({ validation, slug }),
    );
    return this.map.mapEventMethodsOutput(response);
  }

  @DELETEProtectedMethod({
    path: EVENT_EVENTS_ROUTES.DELETE_OTHER.PATH,
    operationDesc: 'Delete other event by slug. Only admin route',
    roles: [Roles.ADMIN],
  })
  async deleteOther(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_EVENTS_ROUTES.DELETE_OTHER.PARAM) slug: string,
    @Body() dto: DeleteOtherEventDto,
  ): Promise<EventMethodsSharedOutput> {
    const response = await firstValueFrom(
      this.eventContract.DeleteOtherEvent({ validation, slug, ...dto }),
    );
    return this.map.mapEventMethodsOutput(response);
  }
}
