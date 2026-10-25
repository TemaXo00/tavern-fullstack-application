import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { EventStatuses } from '@org/enums'
import { EVENT_MESSAGES } from '@org/validation-messages'

@Injectable()
export class EventParticipantTransactionsValidateUtil {
  // JOIN/LEAVE Transaction checks
  throwEventInTransactionNotFound(): never {
    throw new RpcException({
      message: EVENT_MESSAGES.EVENT_NOT_FOUND,
      code: status.NOT_FOUND,
    })
  }

  checkEventJoinBlocked(isBlocked: boolean): void {
    if (isBlocked) {
      throw new RpcException({
        message: EVENT_MESSAGES.JOIN_BLOCKED,
        code: status.PERMISSION_DENIED,
      })
    }
  }

  checkEventNotFinished(dateAndTime: Date): void {
    if (dateAndTime < new Date()) {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_FINISHED,
        code: status.ABORTED,
      })
    }
  }

  checkEventStatus(eventStatus: EventStatuses): void {
    if (eventStatus !== 'PUBLISHED') {
      throw new RpcException({
        message: EVENT_MESSAGES.EVENT_JOIN_NOT_PUBLISHED,
        code: status.CANCELLED,
      })
    }
  }

  throwUserInTransactionNotFound(): never {
    throw new RpcException({
      message: EVENT_MESSAGES.USER_NOT_FOUND,
      code: status.NOT_FOUND,
    })
  }

  checkUserActive(isActive: boolean): void {
    if (!isActive) {
      throw new RpcException({
        message: EVENT_MESSAGES.USER_NOT_ACTIVE,
        code: status.INVALID_ARGUMENT,
      })
    }
  }

  throwUserParticipant(): never {
    throw new RpcException({
      message: EVENT_MESSAGES.USER_PARTICIPANT,
      code: status.ALREADY_EXISTS,
    })
  }
}
