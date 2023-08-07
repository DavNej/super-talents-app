import * as Yup from 'yup'

export interface IFormValues {
  handle: string
  name: string
  bio: string
  skills: string[]
  otherLink: string
  github: string
  twitter: string
  portefolio: string
  role: 'buyer' | 'seller' | 'both' | ''
}

export const initialValues: IFormValues = {
  handle: '',
  name: '',
  bio: '',
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
  bio: Yup.string()
    .min(20, 'Bio too short')
    .max(500, 'Bio too long')
    .trim()
    .required(),
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
