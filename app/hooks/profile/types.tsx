type Role = 'buyer' | 'seller' | 'both'

export interface IProfile {
  handle: string

  /* TalentLayer */
  name: string
  about: string
  skills: string[]
  picture: string
  role: Role | ''

  /* SuperTalents Additionnal */
  github: string
  twitter: string
  portefolio: string
  otherLink: string
}

export type IProfileIPFS = Omit<IProfile, 'handle'>
export type IProfileForm = Omit<IProfile, 'picture'>
