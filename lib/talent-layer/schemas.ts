import z from 'zod'

export const Handle = z.string({
  required_error: 'Handle is required',
  invalid_type_error: 'Handle must be a string',
})

export const Id = z.string({
  invalid_type_error: 'Id must be a string',
})

export const Cid = z
  .string({
    invalid_type_error: 'Cid must be a string',
  })
  .optional()

export const Address = z.string({
  invalid_type_error: 'Address must be a string',
})

export const TalentLayerUser = z.object({
  handle: Handle,
  id: Id,
  cid: Cid,
  address: Address,
})
