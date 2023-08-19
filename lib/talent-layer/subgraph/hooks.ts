import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { getTalentLayerUser, handleExists } from '../subgraph'
import type { ITalentLayerUser, IFetchUserParams } from '../types'

export function useTalentLayerUser(
  { handle, address, id }: IFetchUserParams,
  options?: UseQueryOptions<ITalentLayerUser | undefined>
) {
  return useQuery<ITalentLayerUser | undefined>({
    queryKey: ['user', { handle, address, id }],
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
