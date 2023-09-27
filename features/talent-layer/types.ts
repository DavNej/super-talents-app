import z from 'zod'
import * as schemas from './schemas'

export type TalentLayerUserType = z.infer<typeof schemas.TalentLayerUser>

export type IFetchTalentLayerUserParams = Partial<
  Omit<TalentLayerUserType, 'cid'>
>
