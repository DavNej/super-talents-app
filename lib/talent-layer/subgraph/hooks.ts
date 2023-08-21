import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { getTalentLayerUser, handleExists } from '../subgraph'
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

export function useHandleExists(
  { handle }: { handle: string },
  options?: UseQueryOptions<boolean>
) {
  return useQuery<boolean>({
    queryKey: ['handleExists'],
    queryFn: () => handleExists(handle),
    ...options,
  })
}
