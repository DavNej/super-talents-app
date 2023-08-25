import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

import api from '@/lib/api'
import type { DataUrlType } from '@/lib/avatar/types'

export default function useCreateAvatars(
  options?: UseMutationOptions<DataUrlType[], unknown, { image: DataUrlType }>
) {
  return useMutation<DataUrlType[], unknown, { image: DataUrlType }>({
    mutationFn: ({ image }) =>
      api.POST<DataUrlType[]>('/api/avatar-gen', { image }),
    ...options,
  })
}
