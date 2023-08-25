import { toast } from 'react-toastify'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { fetchFromIPFS } from '@/lib/ipfs'

import { IPFSProfile } from '@/lib/profile/schemas'
import { IPFSProfileType } from '@/lib/profile/types'

export default function useProfileData({
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
