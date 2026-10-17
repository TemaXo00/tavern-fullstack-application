import { Injectable } from '@nestjs/common';
import { EventDatabaseService } from '@org/event-database';
import { AdminBlockUserEvent, AuthRegisteredMessage } from '@org/rmq-messages';

@Injectable()
export class EventRmqDatabaseUtil {
  constructor(private readonly db: EventDatabaseService) {}

  // GET

  async getUser(id: string): Promise<boolean> {
    const user = await this.db.eventUserSnapshot.findUnique({
      where: {
        userId: id,
      },
    });
    return user !== null;
  }

  // CREATE

  async createUserSnapshot(message: AuthRegisteredMessage): Promise<void> {
    await this.db.eventUserSnapshot.upsert({
      where: { userId: message.id },
      create: {
        userId: message.id,
        nickname: message.id,
        email: message.email,
      },
      update: {
        email: message.email,
      },
    });
  }

  // UPDATE

  async blockUser(message: AdminBlockUserEvent): Promise<void> {
    await this.db.$transaction(async (tx) => {
      await tx.event.updateMany({
        where: {
          organizerId: message.userId,
          status: 'PUBLISHED',
        },
        data: {
          organizerId: message.adminId,
        },
      });
      await tx.eventUserSnapshot.update({
        where: {
          userId: message.userId,
        },
        data: {
          isActive: false,
        },
      });
    });
  }

  async updateUserActivityState(
    id: string,
    state: boolean,
    deleted?: boolean,
  ): Promise<void> {
    await this.db.eventUserSnapshot.update({
      where: {
        userId: id,
      },
      data: {
        isActive: state,
        deletedAt: deleted ? new Date() : null,
      },
    });
  }

  async updateUserEmail(id: string, email: string): Promise<void> {
    await this.db.eventUserSnapshot.update({
      where: {
        userId: id,
      },
      data: {
        email,
      },
    });
  }

  async updateUserNickname(id: string, nickname: string): Promise<void> {
    await this.db.eventUserSnapshot.update({
      where: {
        userId: id,
      },
      data: {
        nickname,
      },
    });
  }
}
