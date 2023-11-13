import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'

import { log } from '@/utils'

import type { IFetchTalentLayerUserParams, TalentLayerUserType } from '../types'
import { getTalentLayerUser } from '../subgraph'
import { TalentLayerUser } from '../schemas'

export default function useTalentLayerUser({
  handle,
  address,
  id,
}: IFetchTalentLayerUserParams) {
  return useQuery<TalentLayerUserType | null>({
    queryKey: ['user', { handle, address, id }],
    enabled: Boolean(handle || address || id),
    queryFn: async () => {
      if (!Boolean(handle || address || id)) return null
      log('👤 | Get TL user')

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
