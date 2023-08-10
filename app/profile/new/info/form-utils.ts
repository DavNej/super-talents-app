import * as Yup from 'yup'

export const roleCaptions = {
  seller: 'Talent seeking projects',
  buyer: 'Client seeking talents',
  both: 'Client seeking for talent and vice versa',
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
