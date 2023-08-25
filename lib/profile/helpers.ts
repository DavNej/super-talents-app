import { FormProfileType } from './types'

export const roleCaptions = {
  seller: 'Talent',
  buyer: 'Client',
  both: 'Both',
}

export const initialValues: FormProfileType = {
  handle: '',
  name: '',
  about: '',
  skills: [],
  github: '',
  otherLink: '',
  portefolio: '',
  twitter: '',
  role: '',
}
