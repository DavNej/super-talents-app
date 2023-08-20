export interface ITalentLayerUser {
  address: string
  handle: string
  id: string
  cid?: string
}

export type IFetchTalentLayerUserParams = Partial<Omit<ITalentLayerUser, 'cid'>>
