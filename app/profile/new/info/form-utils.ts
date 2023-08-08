import * as Yup from 'yup'

export interface IFormValues {
  handle: string
  name: string
  about: string
  skills: string[]
  otherLink: string
  github: string
  twitter: string
  portefolio: string
  role: 'buyer' | 'seller' | 'both' | ''
}
export interface IProfileData {
  name: string
  about: string
  skills: string[]
  // skills_raw: string
  github: string
  otherLink: string
  portefolio: string
  twitter: string
  picture: string
  role: 'buyer' | 'seller' | 'both' | ''
}

export const initialValues: IFormValues = {
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

export const validationSchema = Yup.object().shape({
  handle: Yup.string()
    .min(2, 'Handle too short')
    .max(10, 'Handle too long')
    .required(),
  name: Yup.string()
    .min(2, 'Name too short')
    .max(140, 'Name too long')
    .trim()
    .required(),
  about: Yup.string()
    .min(20, 'Bio too short')
    .max(500, 'Bio too long')
    .trim()
    .required('Bio is a required field'),
  skills: Yup.array()
    .min(1, 'Add at least one skill')
    .max(15, 'Skill set should be less than 15')
    .required(),
  github: Yup.string().url('Must be a github url').trim(),
  otherLink: Yup.string().url('Must be a url').trim(),
  portefolio: Yup.string().url('Must be a url').trim(),
  twitter: Yup.string().url('Must be a twitter url').trim(),
  role: Yup.string().required(),
})
