import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class BlogDatabaseService extends PrismaClient {
  constructor(protected readonly config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow<string>('TAVERN_BLOG_DB_URL'),
    });
    super({ adapter });
  }
}
