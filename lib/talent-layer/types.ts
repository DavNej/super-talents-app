import z from 'zod'
import * as validator from './validate'

export type TalentLayerUserType = z.infer<typeof validator.TalentLayerUser>

export type IFetchTalentLayerUserParams = Partial<
  Omit<TalentLayerUserType, 'cid'>
>
