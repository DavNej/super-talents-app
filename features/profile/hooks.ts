import { toast } from 'react-toastify'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { fetchFromIPFS } from '@/lib/ipfs'
import { getTalentLayerUser } from '@/lib/talent-layer/subgraph'
import { TalentLayerUser } from '@/lib/talent-layer/validate'
import type {
  IFetchTalentLayerUserParams,
  TalentLayerUserType,
} from '@/lib/talent-layer/types'

import { IPFSProfile } from './validate'
import { IPFSProfileType } from './types'

export function useProfileData({
  cid,
}: {
  cid: string | undefined | null
}): UseQueryResult<IPFSProfileType | null> {
  return useQuery<IPFSProfileType | null>({
    queryKey: ['profile', { cid }],
    queryFn: async () => {
      if (!cid) return null

      const data = await fetchFromIPFS({ cid })
      if (!data) return null

      const result = IPFSProfile.safeParse(data)
      if (result.success) return result.data

      console.warn(
        'Zod validation',
        JSON.stringify(result.error.issues, null, 2)
      )
      toast.warn('Wrong Profile data format')
      return data as IPFSProfileType
    },
  })
}

export function useUser({
  handle,
  address,
  id,
}: IFetchTalentLayerUserParams): UseQueryResult<TalentLayerUserType | null> {
  return useQuery<TalentLayerUserType | null>({
    queryKey: ['user', { handle, address, id }],
    queryFn: async () => {
      if (!Boolean(handle || address || id)) return null

      const data = await getTalentLayerUser({ handle, address, id })
      if (!data) return null

      const result = TalentLayerUser.safeParse(data)
      if (result.success) return result.data

      console.warn(
        'Zod validation',
        JSON.stringify(result.error.issues, null, 2)
      )

      toast.warn('Wrong TalentLayer user format')
      return data as TalentLayerUserType
    },
  })
}
