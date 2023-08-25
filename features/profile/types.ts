import z from 'zod'
import * as schemas from './schemas'

export type RoleType = z.infer<typeof schemas.RoleEnum>
export type HandleType = z.infer<typeof schemas.Handle>
export type NameType = z.infer<typeof schemas.Name>
export type AboutType = z.infer<typeof schemas.About>
export type SkillsType = z.infer<typeof schemas.Skills>
export type GithubType = z.infer<typeof schemas.Github>
export type TwitterType = z.infer<typeof schemas.Twitter>
export type LinkType = z.infer<typeof schemas.Link>
export type PictureType = z.infer<typeof schemas.Picture>

export type FormProfileType = z.infer<typeof schemas.FormProfile>
export type NewProfileType = z.infer<typeof schemas.NewProfile>
export type IPFSProfileType = z.infer<typeof schemas.IPFSProfile>
