import { CreateBlogTagSharedInput } from '@org/shared-types'

import { Name } from '../../decorators/shared/name.decorator.js'

export class CreateBlogTagDto implements CreateBlogTagSharedInput {
  @Name()
  name: string
}
