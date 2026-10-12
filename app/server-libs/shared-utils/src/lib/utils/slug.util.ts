import { Injectable } from '@nestjs/common';
import { SHARED_MESSAGES } from '@org/validation-messages';
import slugify from 'slugify';

import { StringValidationUtil } from './string-validation.util';

@Injectable()
export class SlugUtil {
  constructor(private readonly stringUtil: StringValidationUtil) {}

  createSlug(input: string): string {
    this.stringUtil.validateAnyString(input, SHARED_MESSAGES.INVALID_SLUG);
    return slugify(input, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
}
