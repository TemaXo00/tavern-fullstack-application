import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import {
  DELETEProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  POSTProtected,
  QUERYMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import {
  AddParticipantDto,
  ChangeParticipantStatusDto,
  DeleteParticipantDto,
  PaginatedParticipantsDto,
  ParticipatedEventsDto,
} from '@org/gateway-dto'
import { EventGatewayMapService } from '@org/gateway-map'
import { EVENT_PARTICIPANT_ROUTES } from '@org/routes-config'
import {
  EventParticipantSharedOutput,
  PaginatedEventParticipantsSharedOutput,
  PaginatedParticipatedEventsSharedOutput,
} from '@org/shared-types'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { EventParticipantsServiceObservableContract, ValidateInput } from '@org/grpc-types'

@HTTPController({
  microserviceName: 'Event',
  serviceName: 'Participant',
})
export class ParticipantController implements OnModuleInit {
  private participantContract!: EventParticipantsServiceObservableContract

  constructor(
    @Inject('EVENT_CLIENT') private readonly client: ClientGrpc,
    private readonly map: EventGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.participantContract = this.client.getService<EventParticipantsServiceObservableContract>('ParticipantService')
  }

  @QUERYMethod({
    path: EVENT_PARTICIPANT_ROUTES.GET_ME.PATH,
    summary: 'Get my participated events',
    operationDesc: 'Returns paginated participated events. Only current user route',
  })
  async getMe(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: ParticipatedEventsDto,
  ): Promise<PaginatedParticipatedEventsSharedOutput> {
    const response = await firstValueFrom(
      this.participantContract.GetMyParticipatedEvents({
        validation,
        pagination: this.map.mapParticipatedEventsPaginationInput(dto),
      }),
    )
    return {
      participant: response.participant,
      pagination: this.map.mapParticipatedEventsPaginationOutput(response.pagination),
      events: this.map.mapParticipatedEventsOutput(response.events),
    }
  }

  @QUERYMethod({
    path: EVENT_PARTICIPANT_ROUTES.GET_USER_PARTICIPATED.PATH,
    summary: 'Get other user participated events',
    operationDesc: 'Returns paginated participated events. Public route',
  })
  async getOther(
    @Param(EVENT_PARTICIPANT_ROUTES.GET_USER_PARTICIPATED.PARAM) nickname: string,
    @Body() dto: ParticipatedEventsDto,
  ): Promise<PaginatedParticipatedEventsSharedOutput> {
    const response = await firstValueFrom(
      this.participantContract.GetUserParticipatedEvents({
        nickname,
        pagination: this.map.mapParticipatedEventsPaginationInput(dto),
      }),
    )
    return {
      participant: response.participant,
      pagination: this.map.mapParticipatedEventsPaginationOutput(response.pagination),
      events: this.map.mapParticipatedEventsOutput(response.events),
    }
  }

  @QUERYMethod({
    path: EVENT_PARTICIPANT_ROUTES.GET_EVENT_PARTICIPANTS.PATH,
    summary: 'Get users list for event',
    operationDesc:
      'Returns paginated output participants list for published event. Public route. Shows all statuses of user',
  })
  async getEventParticipants(
    @Param(EVENT_PARTICIPANT_ROUTES.GET_EVENT_PARTICIPANTS.PARAM) slug: string,
    @Body() dto: PaginatedParticipantsDto,
  ): Promise<PaginatedEventParticipantsSharedOutput> {
    const response = await firstValueFrom(
      this.participantContract.GetPaginatedEventParticipants({
        slug,
        pagination: this.map.mapEventParticipantsPaginationInput(dto),
      }),
    )
    return {
      event: this.map.mapParticipatedEventOutput(response.event),
      pagination: this.map.mapEventParticipantsPaginationOutput(response.pagination),
      participants: this.map.mapListOfEventParticipantOutput(response.participants),
    }
  }

  @POSTProtected({
    path: EVENT_PARTICIPANT_ROUTES.JOIN_EVENT.PATH,
    summary: 'Join to event',
    operationDesc:
      'Method for join to event. Logic: if available places > 0 - you assign as participant. In other case, you stay in WAITLIST',
  })
  async joinEvent(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_PARTICIPANT_ROUTES.JOIN_EVENT.PARAM) slug: string,
  ): Promise<EventParticipantSharedOutput> {
    const response = await firstValueFrom(
      this.participantContract.JoinEvent({
        validation,
        slug,
      }),
    )
    return this.map.mapEventParticipantOutput(response)
  }

  @DELETEProtectedMethod({
    path: EVENT_PARTICIPANT_ROUTES.LEAVE_EVENT.PATH,
    summary: 'Leave from event',
    operationDesc:
      'Leave have next logic: if you in WAITLIST, you just removes from this. If you in main list - your place belongs to first from WAITLIST',
  })
  async leaveEvent(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_PARTICIPANT_ROUTES.LEAVE_EVENT.PARAM) slug: string,
  ): Promise<EventParticipantSharedOutput> {
    const response = await firstValueFrom(
      this.participantContract.LeaveEvent({
        validation,
        slug,
      }),
    )
    return this.map.mapEventParticipantOutput(response)
  }

  @POSTProtected({
    path: EVENT_PARTICIPANT_ROUTES.ADD_USER.PATH,
    summary: 'Add user to event',
    operationDesc:
      'Logic same to join event. If available places > 0 - you assign as participant. In other case, you stay in WAITLIST',
  })
  async addUser(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_PARTICIPANT_ROUTES.ADD_USER.PARAM) slug: string,
    @Body() dto: AddParticipantDto,
  ): Promise<EventParticipantSharedOutput> {
    const response = await firstValueFrom(
      this.participantContract.AddUserToEvent({
        validation,
        slug,
        ...dto,
      }),
    )
    return this.map.mapEventParticipantOutput(response)
  }

  @PATCHProtectedMethod({
    path: EVENT_PARTICIPANT_ROUTES.CHANGE_USER_STATUS.PATH,
    summary: 'Change participant status',
    operationDesc:
      'If event is FINISHED, you can set statuses FIXED or NOT_COME. In PUBLISHED case, you can choose between WAITLIST and RECORDED. In case of CANCELLED or DRAFT, you cannot change status',
  })
  async updateUserStatus(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_PARTICIPANT_ROUTES.CHANGE_USER_STATUS.PARAM) slug: string,
    @Body() dto: ChangeParticipantStatusDto,
  ): Promise<EventParticipantSharedOutput> {
    const mappedDto = this.map.mapChangeUserStatus(dto)
    const response = await firstValueFrom(
      this.participantContract.ChangeUserStatus({
        validation,
        slug,
        ...mappedDto,
      }),
    )
    return this.map.mapEventParticipantOutput(response)
  }

  @DELETEProtectedMethod({
    path: EVENT_PARTICIPANT_ROUTES.REMOVE_FROM_EVENT.PATH,
    summary: 'Remove user from event',
    operationDesc:
      'Logic same to leave event. If you in WAITLIST, you just removes from this. If you in main list - your place belongs to first from WAITLIST',
  })
  async deleteUser(
    @ValidateInputParam() validation: ValidateInput,
    @Param(EVENT_PARTICIPANT_ROUTES.REMOVE_FROM_EVENT.PARAM) slug: string,
    @Body() dto: DeleteParticipantDto,
  ): Promise<EventParticipantSharedOutput> {
    const response = await firstValueFrom(
      this.participantContract.RemoveUserFromEvent({
        validation,
        slug,
        ...dto,
      }),
    )
    return this.map.mapEventParticipantOutput(response)
  }
}
