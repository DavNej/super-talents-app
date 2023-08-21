import z from 'zod'
import * as validator from './validate'

export type RoleType = z.infer<typeof validator.RoleEnum>
export type HandleType = z.infer<typeof validator.Handle>
export type NameType = z.infer<typeof validator.Name>
export type AboutType = z.infer<typeof validator.About>
export type SkillsType = z.infer<typeof validator.Skills>
export type GithubType = z.infer<typeof validator.Github>
export type TwitterType = z.infer<typeof validator.Twitter>
export type LinkType = z.infer<typeof validator.Link>
export type PictureType = z.infer<typeof validator.Picture>

export type FormProfileType = z.infer<typeof validator.FormProfile>
export type NewProfileType = z.infer<typeof validator.NewProfile>
export type IPFSProfileType = z.infer<typeof validator.IPFSProfile>
