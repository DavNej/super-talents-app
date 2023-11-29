import { useQuery } from '@tanstack/react-query'

import type { IFetchTalentLayerUserParams, TalentLayerUserType } from '../types'
import { getTalentLayerUser } from '../subgraph'

export default function useTalentLayerUser({
  handle,
  address,
  id,
}: IFetchTalentLayerUserParams) {
  return useQuery<TalentLayerUserType | null>({
    queryKey: ['user', { handle, address, id }],
    enabled: Boolean(handle || address || id),
    queryFn: async () => getTalentLayerUser({ handle, address, id }),
  })
}
