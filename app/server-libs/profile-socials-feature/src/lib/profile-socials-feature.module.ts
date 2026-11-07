import { Module } from '@nestjs/common'

import { ProfileSocialFeatureController } from './profile-social-feature.controller'
import { ProfileSocialsFeatureService } from './profile-socials-feature.service'

@Module({
  controllers: [ProfileSocialFeatureController],
  providers: [ProfileSocialsFeatureService],
})
export class ProfileSocialsFeatureModule {}
