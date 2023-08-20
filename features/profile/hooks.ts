import { useTalentLayerUser } from '@/lib/talent-layer/subgraph/hooks'
import type { IFetchUserParams } from '@/lib/talent-layer/types'

import { useGetFromIPFS } from '@/lib/ipfs/hooks'

import { IPFSProfile } from '@/features/profile/validate'
import { IPFSProfileType } from '@/features/profile/types'

import { toast } from 'react-toastify'

export function useProfile({ handle, address, id }: IFetchUserParams) {
  const user = useTalentLayerUser({ handle, address, id })

  const profile = useGetFromIPFS({ cid: user.data?.cid })

  if (user.data === undefined || profile.data === undefined) {
    return { isLoading: true, data: null }
  }

  if (user.data === null || profile.data === null) {
    return { isLoading: false, data: null }
  }

  if (!user.isSuccess || !profile.isSuccess) {
    return { isLoading: false, data: null }
  }

  const result = IPFSProfile.safeParse(profile.data)

  if (!result.success) {
    console.warn('Zod validation', JSON.stringify(result.error.issues, null, 2))
    toast.warn('Wrong Profile data format')
    const data = profile.data as IPFSProfileType
    return { isLoading: false, data }
  }

  return { isLoading: false, data: result.data }
}
