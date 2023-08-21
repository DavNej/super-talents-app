import type { ChatCompletionResponseMessage } from 'openai'
import { useMutation } from '@tanstack/react-query'

import api from '@/lib/api'

export function useChatGPT() {
  return useMutation<ChatCompletionResponseMessage | null, unknown, string>({
    mutationFn: prompt => api.POST('/api/improve-bio', { prompt }),
  })
}
