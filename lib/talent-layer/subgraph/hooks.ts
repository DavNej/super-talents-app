import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { getTalentLayerUser, profileIdOfHandle } from '../subgraph'
import type { TalentLayerUserType, IFetchTalentLayerUserParams } from '../types'

export function useTalentLayerUser(
  { handle, address, id }: IFetchTalentLayerUserParams,
  options?: UseQueryOptions<TalentLayerUserType | null>
) {
  return useQuery<TalentLayerUserType | null>({
    queryKey: ['user', { handle, address, id }],
    enabled: Boolean(handle || address || id),
    queryFn: () =>
      getTalentLayerUser({
        handle,
        address,
        id,
      }),
    ...options,
  })
}

export function useProfileIdOfHandle(
  { handle }: { handle: string },
  options?: UseQueryOptions<number | null>
) {
  return useQuery<number | null>({
    queryKey: ['profile-id-of-handle', handle],
    enabled: Boolean(handle),
    queryFn: () => profileIdOfHandle(handle),
    ...options,
  })
}
