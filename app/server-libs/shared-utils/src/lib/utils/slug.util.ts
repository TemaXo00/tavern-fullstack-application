import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugUtil {
  createSlug(input: string): string {
    return slugify(input, {
      replacement: '-',
      lower: false,
      trim: true,
    });
  }
}
