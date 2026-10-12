import { Injectable } from '@nestjs/common';
import { AuthValidateService } from '@org/auth-authorization-core';
import { Roles } from '@org/enums';
import {
  EventTagCacheUtil,
  EventTagDatabaseUtil,
  EventTagMessagesUtil,
  EventTagValidateUtil,
} from '@org/event-utils';
import { SlugUtil } from '@org/shared-utils';

import type {
  CreateEventTagInput,
  DeleteEventTagInput,
  EventTagDetailedOutput,
  EventTagOutput,
  EventTagServiceContract,
  GetEventTagInput,
  GetPaginatedEventTagsInput,
  PaginatedEventTagsOutput,
  UpdateEventTagInput,
} from '@org/grpc-types';

@Injectable()
export class TagFeatureService implements EventTagServiceContract {
  constructor(
    private readonly dbUtil: EventTagDatabaseUtil,
    private readonly validateUtil: EventTagValidateUtil,
    private readonly cacheUtil: EventTagCacheUtil,
    private readonly messagesUtil: EventTagMessagesUtil,
    private readonly validation: AuthValidateService,
    private readonly slugUtil: SlugUtil,
  ) {}

  async GetPaginatedTags(
    data: GetPaginatedEventTagsInput,
  ): Promise<PaginatedEventTagsOutput> {
    return await this.dbUtil.getPaginatedTags(data.pagination);
  }

  async GetTagBySlug(data: GetEventTagInput): Promise<EventTagDetailedOutput> {
    const redisCache = await this.cacheUtil.get(data.slug);
    if (redisCache) {
      return redisCache;
    }
    const tag = await this.validateUtil.checkTagExisting(data.slug);
    await this.cacheUtil.set(tag);
    return tag;
  }

  async CreateTag(data: CreateEventTagInput): Promise<EventTagOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
    ]);
    const slug = this.slugUtil.createSlug(data.name);
    await this.validateUtil.checkSlugUnique(slug);
    const tag = await this.dbUtil.createTag(data, slug);
    this.messagesUtil.create({ adminId: payload.id, tagSlug: slug });
    return tag;
  }

  async UpdateTag(data: UpdateEventTagInput): Promise<EventTagOutput> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
    ]);
    await this.validateUtil.checkTagExisting(data.slug);
    const updated = await this.dbUtil.updateTag(data.slug, data);
    await this.cacheUtil.del(data.slug);
    this.messagesUtil.update({ adminId: payload.id, slug: data.slug, data });
    return updated;
  }

  async DeleteTag(data: DeleteEventTagInput): Promise<void> {
    const payload = await this.validation.validateWithRoles(data.validation, [
      Roles.ADMIN,
    ]);
    await this.validateUtil.checkTagExisting(data.slug);
    await this.dbUtil.deleteTag(data.slug);
    await this.cacheUtil.del(data.slug);
    this.messagesUtil.delete({ adminId: payload.id, tagSlug: data.slug });
  }
}
