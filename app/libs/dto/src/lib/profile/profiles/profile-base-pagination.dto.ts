import { ProfilePaginationBaseInput } from '@org/types';

import { BasePaginationDto } from '../../shared/pagination-base.dto.js';

export class ProfileBasePaginationDto
  extends BasePaginationDto
  implements ProfilePaginationBaseInput {}
