export interface SocialBaseOutput {
  id: string
  profileId: string
  socialName: string
  socialUrl: string
}

export interface AllSocialsBaseOutput {
  socials: SocialBaseOutput[]
}
