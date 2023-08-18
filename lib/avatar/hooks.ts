import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

import api from '@/lib/api'

import type { TImageOutput } from './types'

export function useAvatars(
  options?: UseMutationOptions<TImageOutput, unknown, { image: string }>
) {
  return useMutation<TImageOutput, unknown, { image: string }>({
    mutationFn: ({ image }) => api.POST<TImageOutput>('/api/avatar-gen', { image }),
    ...options,
  })
}
