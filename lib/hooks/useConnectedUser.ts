import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'

import { log } from '@/lib/utils'
import { getTalentLayerUser } from '@/lib/talent-layer/subgraph'
import { TalentLayerUser } from '@/lib/talent-layer/schemas'
import type { TalentLayerUserType } from '@/lib/talent-layer/types'

import useAuth from './useAuth'

export default function useConnectedUser() {
  const { provider } = useAuth()
  const address = provider?.signerAddress

  const connectedUser = useQuery<TalentLayerUserType | null>({
    queryKey: ['connected-user'],
    enabled: Boolean(address),
    queryFn: async () => {
      log('👤 | TL connected-user')
      if (!address) return null
      log('👤 | TL connected-user hit')

      const data = await getTalentLayerUser({ address })
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

  return connectedUser
}
