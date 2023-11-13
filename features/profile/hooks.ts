import { UseQueryResult, useQuery } from '@tanstack/react-query'

import api from '@/utils/api'
import { log } from '@/utils'

import { validateIPFSProfile } from './schemas'
import { ProfileWithPictureType } from './types'

export default function useProfileData({
  cid,
}: {
  cid: string | undefined | null
}): UseQueryResult<ProfileWithPictureType | null> {
  return useQuery<ProfileWithPictureType | null>({
    queryKey: ['profile-data', { cid }],
    enabled: Boolean(cid),
    queryFn: async () => {
      if (!cid) return null
      log('📖 | Get profile data from IPFS')

      const data = await api.GET(`/api/profile-info/${cid}`)
      return validateIPFSProfile(data)
    },
  })
}
