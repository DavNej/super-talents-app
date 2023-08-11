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
  name: string
  about: string
  skills: string[]
  // skills_raw: string
  role: Role
  github: string
  twitter: string
  portefolio: string
  otherLink: string
  picture: string
}
