export interface CreateSocialBaseInput {
  socialName: string
  socialUrl: string
}

export interface DeleteSocialBaseInput {
  socialId: string
}

export interface GetOtherUserSocialsBaseInput {
  nickname: string
}
