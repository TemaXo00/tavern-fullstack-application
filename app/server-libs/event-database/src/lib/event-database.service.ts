import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class EventDatabaseService extends PrismaClient {
  constructor(protected readonly config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow<string>('TAVERN_EVENT_DB_URL'),
    });
    super({ adapter });
  }
}
