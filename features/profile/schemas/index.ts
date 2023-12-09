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

export const ProfileWithPicture = BaseProfile.extend({
  picture: partials.Picture,
})

export function validateIPFSProfile(profile: unknown) {
  if (!profile) return null

  const result = ProfileWithPicture.safeParse(profile)
  if (result.success) return result.data

  console.warn('Zod validation', JSON.stringify(result.error.issues, null, 2))
  return profile as ProfileWithPictureType
}
