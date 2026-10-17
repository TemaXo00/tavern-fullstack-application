import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

import type { ProfileAdvancedOutput, ProfileBaseOutput } from '@org/grpc-types'

@Injectable()
export class ProfileCacheUtil {
  private readonly TTL: number

  constructor(
    @InjectRedis() private readonly cache: Redis,
    private readonly config: ConfigService,
  ) {
    this.TTL = this.config.get<number>('TAVERN_PROFILE_CACHE_TTL', 300)
  }

  async cacheBase(profile: ProfileBaseOutput): Promise<void> {
    await this.cache.set(`profile-base:${profile.nickname}`, JSON.stringify(profile), 'EX', this.TTL)
  }

  async cacheAdvanced(profile: ProfileAdvancedOutput): Promise<void> {
    await this.cache.set(`profile-advanced:${profile.nickname}`, JSON.stringify(profile), 'EX', this.TTL)
  }

  async getBase(nickname: string): Promise<ProfileBaseOutput | null> {
    try {
      const profile = await this.cache.get(`profile-base:${nickname}`)
      return profile ? JSON.parse(profile) : null
    } catch {
      return null
    }
  }

  async getAdvanced(nickname: string): Promise<ProfileAdvancedOutput | null> {
    try {
      const profile = await this.cache.get(`profile-advanced:${nickname}`)
      return profile ? JSON.parse(profile) : null
    } catch {
      return null
    }
  }

  async deleteCache(nickname: string): Promise<void> {
    const keys = [`profile-base:${nickname}`, `profile-advanced:${nickname}`]
    await this.cache.del(...keys)
  }
}
