import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

import { uploadToIPFS } from './helpers'

type ReturnedData = string
type MutationParams = { name: string; content: unknown }
type Options = UseMutationOptions<ReturnedData, unknown, MutationParams>

export default function useUploadToIPFS(options?: Options) {
  return useMutation<ReturnedData, unknown, MutationParams>({
    mutationFn: ({ name, content }) => uploadToIPFS({ name, content }),
    ...options,
  })
}
