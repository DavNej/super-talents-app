import z from 'zod'
import { type TalentLayerUserType } from './types'

export const Handle = z.string({
  required_error: 'Handle is required',
  invalid_type_error: 'Handle must be a string',
})

export const profileId = z.union([z.number(), z.string()], {
  invalid_type_error: 'Id must be a string or number',
})

export const Cid = z.string({
  invalid_type_error: 'Cid must be a string',
})

export const Address = z.string({
  invalid_type_error: 'Address must be a string',
})

export const TalentLayerUser = z.object({
  handle: Handle,
  id: profileId,
  cid: Cid.optional(),
  address: Address,
})

export function validateTalentLayerUser(user: unknown) {
  const result = TalentLayerUser.safeParse(user)
  if (result.success) return result.data

  console.warn('Zod validation', JSON.stringify(result.error.issues, null, 2))
  return user as TalentLayerUserType
}
