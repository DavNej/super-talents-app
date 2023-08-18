export interface ITalentLayerUser {
  address: string
  handle: string
  id: string
  cid?: string
}

export interface IFetchUserParams {
  handle?: string
  address?: string
  id?: string
}
