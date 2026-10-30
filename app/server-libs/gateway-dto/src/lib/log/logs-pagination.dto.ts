import { LogPaginationSharedInput } from '@org/shared-types'

import { IsAdminAction } from '../decorators/log/is-admin-action.decorator.js'
import { LogDate } from '../decorators/log/log-date.decorator.js'
import { Name } from '../decorators/shared/name.decorator.js'
import { BasePaginationDto } from '../shared/pagination-base.dto.js'

export class LogsPaginationDto extends BasePaginationDto implements LogPaginationSharedInput {
  @LogDate(false)
  dateFrom?: Date

  @LogDate(false)
  dateTo?: Date

  @Name(false)
  microserviceName?: string

  @Name(false)
  serviceName?: string

  @IsAdminAction({ required: false })
  isAdminAction?: boolean
}
