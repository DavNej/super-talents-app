import z from 'zod'

export const RoleEnum = z.enum(['buyer', 'seller', 'both'])

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
