import { CreateSocialSharedInput } from '@org/shared-types'

import { SocialUrl } from '../../decorators/profile/social-url.decorator.js'
import { Name } from '../../decorators/shared/name.decorator.js'

export class CreateSocialDto implements CreateSocialSharedInput {
  @Name()
  socialName: string
  @SocialUrl()
  socialUrl: string
}
