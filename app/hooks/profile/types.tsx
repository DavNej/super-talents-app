type Role = 'buyer' | 'seller' | 'both'

export interface IFormValues {
  handle: string
  name: string
  about: string
  skills: string[]
  role: Role | ''
  github: string
  twitter: string
  portefolio: string
  otherLink: string
}

export interface IProfileData {
  /* TalentLayer */
  name: string
  about: string
  skills: string[]
  picture: string
  // skills_raw: string
  role: Role

  /* SuperTalents Additionnal */
  github: string
  twitter: string
  portefolio: string
  otherLink: string
}
