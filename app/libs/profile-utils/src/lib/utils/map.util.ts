import { Injectable } from '@nestjs/common';
import { Profile } from '@org/profile-database';
import {
  ACTIVITY_TO_GRPC,
  ProfileAdvancedOutput,
  ProfileBaseOutput,
} from '@org/types';

@Injectable()
export class ProfileMapUtil {
  mapBase(profile: Profile): ProfileBaseOutput {
    return {
      nickname: profile.nickname,
      name: profile.name,
      surname: profile.surname,
      description: profile.description,
      avatarId: profile.avatarId,
      reputationScore: profile.reputationScore,
      currentActivity: ACTIVITY_TO_GRPC[profile.currentActivity],
    };
  }

  mapAdvanced(profile: Profile): ProfileAdvancedOutput {
    return {
      ...this.mapBase(profile),
      id: profile.id,
      userId: profile.userId,
      birthDate: profile.birthDate,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
