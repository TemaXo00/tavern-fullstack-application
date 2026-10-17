import { BasePaginationDto } from '../../shared/pagination-base.dto.js'

import type { ProfilePaginationBaseSharedInput } from '@org/shared-types'

export class ProfileBasePaginationDto extends BasePaginationDto implements ProfilePaginationBaseSharedInput {}
