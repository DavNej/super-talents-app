import { toast } from 'react-toastify'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

import api from '@/lib/api'

import { IPFSProfile } from '@/lib/profile/schemas'
import { IPFSProfileType } from '@/lib/profile/types'


//TODO typesafe api IPFS call with zod
export default function useProfileData({
  cid,
}: {
  cid: string | undefined | null
}): UseQueryResult<IPFSProfileType | null> {
  return useQuery<IPFSProfileType | null>({
    queryKey: ['profile-data', { cid }],
    enabled: Boolean(cid),
    queryFn: async () => {
      if (!cid) return null

      const data = await api.GET(`/api/ipfs/${cid}`)
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
