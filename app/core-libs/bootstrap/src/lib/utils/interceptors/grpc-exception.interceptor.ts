import { status } from '@grpc/grpc-js'
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  GatewayTimeoutException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable, catchError, throwError } from 'rxjs'

import type { ServiceError } from '@grpc/grpc-js'

type GrpcExceptionFactory = (message: string) => HttpException

const GRPC_TO_HTTP_EXCEPTION: Record<number, GrpcExceptionFactory> = {
  [status.CANCELLED]: (message) => new HttpException(message, 499),
  [status.UNKNOWN]: (message) => new InternalServerErrorException(message),
  [status.INVALID_ARGUMENT]: (message) => new BadRequestException(message),
  [status.DEADLINE_EXCEEDED]: (message) => new GatewayTimeoutException(message),
  [status.NOT_FOUND]: (message) => new NotFoundException(message),
  [status.ALREADY_EXISTS]: (message) => new ConflictException(message),
  [status.PERMISSION_DENIED]: (message) => new ForbiddenException(message),
  [status.RESOURCE_EXHAUSTED]: (message) => new HttpException(message, HttpStatus.TOO_MANY_REQUESTS),
  [status.FAILED_PRECONDITION]: (message) => new BadRequestException(message),
  [status.ABORTED]: (message) => new ConflictException(message),
  [status.OUT_OF_RANGE]: (message) => new BadRequestException(message),
  [status.UNIMPLEMENTED]: (message) => new NotImplementedException(message),
  [status.INTERNAL]: (message) => new InternalServerErrorException(message),
  [status.UNAVAILABLE]: (message) => new ServiceUnavailableException(message),
  [status.DATA_LOSS]: (message) => new InternalServerErrorException(message),
  [status.UNAUTHENTICATED]: (message) => new UnauthorizedException(message),
}

const DEFAULT_GRPC_EXCEPTION: GrpcExceptionFactory = (message) => new InternalServerErrorException(message)

@Injectable()
export class GrpcExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(catchError((error: unknown) => throwError(() => this.mapError(error))))
  }

  private mapError(error: unknown): unknown {
    if (error instanceof HttpException || !this.isGrpcError(error)) {
      return error
    }

    return this.createHttpException(error)
  }

  private createHttpException(error: ServiceError): HttpException {
    const message = error.details || error.message
    const factory = GRPC_TO_HTTP_EXCEPTION[error.code] ?? DEFAULT_GRPC_EXCEPTION

    return factory(message)
  }

  private isGrpcError(error: unknown): error is ServiceError {
    if (typeof error !== 'object' || error === null) {
      return false
    }

    const candidate = error as ServiceError

    return typeof candidate.code === 'number' && typeof candidate.details === 'string'
  }
}
