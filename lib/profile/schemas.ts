import z from 'zod'
import { IPFSProfileType } from './types'

export const RoleEnum = z.enum(['buyer', 'seller', 'both'])

export const Handle = z
  .string({
    required_error: 'Handle is required',
    invalid_type_error: 'Handle must be a string',
  })
  // TODO improve regex for handle (no - or _ as first char)
  .regex(/^([a-z|\-|\_])+$/, {
    message: 'Handle must contain only letters, - or _',
  })
  .max(31, { message: 'Handle cannot exceed 31 characters' })

export const Name = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
  // TODO add regex for name field
  // .regex(/^([a-z|\-|\s])+$/, {
  //   message: 'Name must contain only letters, spaces or -',
  // })
  .min(2, { message: 'Name too short' })
  .max(140, { message: 'Name cannot exceed 140 characters' })

export const About = z
  .string({
    required_error: 'About is required',
    invalid_type_error: 'About must be a string',
  })
  .min(20, { message: 'About must be at least 20 characters long' })
  .max(5000, { message: 'About cannot exceed 5000 characters' })

export const Skills = z
  .array(z.string().min(2, { message: 'Skill too short' }))
  .nonempty({
    message: 'Add at least one skill',
  })

export const Github = z
  .string()
  .url({ message: 'Must be a valid url' })
  .includes('github', { message: 'Must be a valid github url' })
  .optional()

export const Twitter = z
  .string()
  .url({ message: 'Must be a valid url' })
  .regex(/^.+(\/\/twitter.com|\/\/x.com){1}.+$/, {
    message: 'Must be a valid twitter url',
  })
  .optional()

export const Link = z
  .string()
  .url({ message: 'Must be a valid url' })
  .optional()

export const Picture = z.string().startsWith('data:image/jpeg;base64', {
  message: 'Picture must be a dataUrl',
})

export const FormProfile = z.object({
  handle: Handle.or(z.string().length(0)),
  name: Name.or(z.string().length(0)),
  about: About.or(z.string().length(0)),
  skills: Skills.or(z.string().array().length(0)),
  role: RoleEnum.or(z.string().length(0)),
  github: Github.or(z.string().length(0)),
  twitter: Twitter.or(z.string().length(0)),
  portfolio: Link.or(z.string().length(0)),
  otherLink: Link.or(z.string().length(0)),
})

export const NewProfile = z.object({
  handle: Handle,
  name: Name,
  about: About,
  skills: Skills,
  role: RoleEnum,
  github: Github,
  twitter: Twitter,
  portfolio: Link,
  otherLink: Link,
})

export const IPFSProfile = z.object({
  name: Name,
  about: About,
  skills: Skills,
  picture: Picture,
  role: RoleEnum,
  github: Github,
  twitter: Twitter,
  portfolio: Link,
  otherLink: Link,
})

export function validateIPFSProfile(profile: unknown) {
  if (!profile) return null

  const result = IPFSProfile.safeParse(profile)
  if (result.success) return result.data

  console.warn('Zod validation', JSON.stringify(result.error.issues, null, 2))
  return profile as IPFSProfileType
}
