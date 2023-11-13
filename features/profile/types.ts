import z from 'zod'
import * as schemas from './schemas'
import * as partials from './schemas/partials'

export type RoleType = z.infer<typeof partials.RoleEnum>
export type HandleType = z.infer<typeof partials.Handle>
export type NameType = z.infer<typeof partials.Name>
export type AboutType = z.infer<typeof partials.About>
export type SkillsType = z.infer<typeof partials.Skills>
export type GithubType = z.infer<typeof partials.Github>
export type TwitterType = z.infer<typeof partials.Twitter>
export type LinkType = z.infer<typeof partials.Link>
export type PictureType = z.infer<typeof partials.Picture>

export type FormProfileType = z.infer<typeof schemas.FormProfile>
export type ProfileWithHandleType = z.infer<typeof schemas.ProfileWithHandle>
export type ProfileWithPictureType = z.infer<typeof schemas.ProfileWithPicture>
