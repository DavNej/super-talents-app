import { UseQueryResult, useQuery } from '@tanstack/react-query'

import api from '@/lib/api'
import { log } from '@/lib/utils'

import { validateIPFSProfile } from '@/lib/profile/schemas'
import { IPFSProfileType } from '@/lib/profile/types'

export default function useProfileData({
  cid,
}: {
  cid: string | undefined | null
}): UseQueryResult<IPFSProfileType | null> {
  return useQuery<IPFSProfileType | null>({
    queryKey: ['profile-data', { cid }],
    enabled: Boolean(cid),
    queryFn: async () => {
      log('📖 | Profile data')
      if (!cid) return null
      log('📖 | Profile data hit')

      const data = await api.GET(`/api/ipfs/${cid}`)
      return validateIPFSProfile(data)
    },
  })
}
