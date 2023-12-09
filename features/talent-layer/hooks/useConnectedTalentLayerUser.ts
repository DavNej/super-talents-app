import { useQuery } from '@tanstack/react-query'

import type { TalentLayerUserType } from '../types'
import { getTalentLayerUser } from '../subgraph'
import { useSmartAccount } from '@/features/smart-account'

export default function useConnectedTalentLayerUser() {
  const { smartAccountAddress } = useSmartAccount()
  return useQuery<TalentLayerUserType | null>({
    queryKey: ['connected-user', smartAccountAddress],
    enabled: Boolean(smartAccountAddress),
    queryFn: async () => getTalentLayerUser({ address: smartAccountAddress }),
  })
}
