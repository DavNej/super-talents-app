import { useQuery } from '@tanstack/react-query'

import { getTalentLayerUser, handleExists } from './subgraph'
import type { ITalentLayerUser, IFetchUserParams } from './types'

export function useTalentLayerUser({ handle, address, id }: IFetchUserParams) {
  return useQuery<ITalentLayerUser | undefined>({
    queryKey: ['user', { handle, address, id }],
    queryFn: () =>
      getTalentLayerUser({
        handle,
        address,
        id,
      }),
  })
}

export function useHandleExists(handle: string) {
  return useQuery<boolean>({
    queryKey: ['handleExists'],
    queryFn: () => handleExists(handle),
  })
}
