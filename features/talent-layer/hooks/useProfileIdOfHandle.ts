import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { profileIdOfHandle } from '../subgraph'

export default function useProfileIdOfHandle(
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
