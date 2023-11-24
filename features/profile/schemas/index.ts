import z from 'zod'
import { ProfileWithPictureType } from '../types'
import * as partials from './partials'

export const BaseProfile = z.object({
  name: partials.Name,
  about: partials.About,
  skills: partials.Skills,
  role: partials.RoleEnum,
  github: partials.Github,
  twitter: partials.Twitter,
  linkedin: partials.Link,
  otherLink: partials.Link,
})

export const ProfileWithHandle = BaseProfile.extend({
  handle: partials.Handle,
})

export const ProfileWithPicture = BaseProfile.extend({
  picture: partials.Picture,
})

export const EmptyString = z.string().length(0)

export const FormProfile = z.object({
  handle: partials.Handle.or(EmptyString),
  name: partials.Name.or(EmptyString),
  about: partials.About.or(EmptyString),
  skills: partials.Skills.or(z.string().array().length(0)),
  role: partials.RoleEnum.or(EmptyString),
  github: partials.Github.or(EmptyString),
  twitter: partials.Twitter.or(EmptyString),
  linkedin: partials.Link.or(EmptyString),
  otherLink: partials.Link.or(EmptyString),
})

export function validateIPFSProfile(profile: unknown) {
  if (!profile) return null

  const result = ProfileWithPicture.safeParse(profile)
  if (result.success) return result.data

  console.warn('Zod validation', JSON.stringify(result.error.issues, null, 2))
  return profile as ProfileWithPictureType
}
