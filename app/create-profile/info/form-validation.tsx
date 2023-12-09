import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import * as partials from '@/features/profile/schemas/partials'

export const EmptyString = z.string().length(0)

export const ProfileFormSchema = z.object({
  name: partials.Name.or(EmptyString),
  about: partials.About.or(EmptyString),
  skills: partials.Skills.or(z.string().array().length(0)),
  role: partials.RoleEnum.or(EmptyString),
  github: partials.Github.or(EmptyString),
  twitter: partials.Twitter.or(EmptyString),
  linkedin: partials.Link.or(EmptyString),
  otherLink: partials.Link.or(EmptyString),
})

export type ProfileFormType = z.infer<typeof ProfileFormSchema>

export const validationSchema = toFormikValidationSchema(ProfileFormSchema)
