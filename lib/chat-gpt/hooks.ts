import api from '@/lib/api'
import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

export function useChatGPT(
  options?: UseMutationOptions<string, unknown, string>
) {
  return useMutation<string, unknown, string>({
    mutationFn: prompt => api.POST('/api/improve-bio', { prompt }),
    ...options,
  })
}
