import { handleExists } from '@/lib/talent-layer'
import * as Yup from 'yup'

export const roleCaptions = {
  seller: 'Talent',
  buyer: 'Client',
  both: 'Both',
}

export const validationSchema = Yup.object().shape({
  handle: Yup.string()
    .required('Please choose a username')
    .min(5, 'Handle too short')
    .max(31, 'Handle too long')
    .matches(/^([a-z|\-|\_])+$/, 'Must contain only letters, - or _')
    .test('handle-available', 'Handle is yo taken', handle =>
      handleExists(handle)
        .then(res => !res)
        .catch(err => !err)
    ),
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
