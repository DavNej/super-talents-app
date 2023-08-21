import z from 'zod'

export const RoleEnum = z.enum(['buyer', 'seller', 'both'])

export const Handle = z
  .string({
    required_error: 'Handle is required',
    invalid_type_error: 'Handle must be a string',
  })
  .regex(/^([a-z|\-|\_])+$/, {
    message: 'Handle must contain only letters, - or _',
  })
  .max(31, { message: 'Handle cannot exceed 31 characters' })

export const Name = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
  .min(2, { message: 'Name too short' })
  .max(140, { message: 'Name cannot exceed 140 characters' })

export const About = z
  .string({
    required_error: 'About is required',
    invalid_type_error: 'About must be a string',
  })
  .min(20, { message: 'About must be at least 20 characters long' })
  .max(500, { message: 'About cannot exceed 500 characters' })

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
  .includes('twitter', { message: 'Must be a valid twitter url' })
  .optional()

export const Link = z
  .string()
  .url({ message: 'Must be a valid url' })
  .optional()

export const Picture = z.string().startsWith('data:image/jpeg;base64', {
  message: 'Picture must be a dataUrl',
})

export const IPFSProfile = z.object({
  name: Name,
  about: About,
  skills: Skills,
  picture: Picture,
  role: RoleEnum,
  github: Github,
  twitter: Twitter,
  portefolio: Link,
  otherLink: Link,
})

export const FormProfile = z.object({
  handle: Handle,
  name: Name,
  about: About,
  skills: Skills,
  picture: Picture,
  role: RoleEnum,
  github: Github,
  twitter: Twitter,
  portefolio: Link,
  otherLink: Link,
})
