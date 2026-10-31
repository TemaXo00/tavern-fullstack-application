import { Injectable } from '@nestjs/common'
import { BlogDatabaseService } from '@org/blog-database'
import { AuthRegisteredMessage } from '@org/rmq-messages'

@Injectable()
export class BlogDatabaseUtil {
  constructor(private readonly db: BlogDatabaseService) {}

  // USER

  async getUserById(id: string): Promise<boolean> {
    const user = await this.db.userSnapshot.findUnique({
      where: {
        userId: id,
      },
    })
    return user !== null
  }

  async getUserByNickname(nickname: string): Promise<boolean> {
    const user = await this.db.userSnapshot.findUnique({
      where: {
        nickname,
      },
    })
    return user !== null
  }

  async createProfile(data: AuthRegisteredMessage): Promise<void> {
    await this.db.userSnapshot.create({
      data: {
        userId: data.id,
        nickname: data.id,
      },
    })
  }

  async updateUserNickname(id: string, nickname: string): Promise<void> {
    await this.db.userSnapshot.update({
      where: {
        userId: id,
      },
      data: {
        nickname,
      },
    })
  }

  async deleteUser(id: string): Promise<void> {
    await this.db.userSnapshot.delete({
      where: { userId: id },
    })
  }
}
