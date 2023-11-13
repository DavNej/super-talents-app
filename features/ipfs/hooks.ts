import type { UseMutationOptions } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

import { uploadToIPFS } from './helpers'

export default function useUploadToIPFS(
  options?: UseMutationOptions<
    string,
    unknown,
    { name: string; content: unknown }
  >
) {
  return useMutation<string, unknown, { name: string; content: unknown }>({
    mutationFn: ({ name, content }) => uploadToIPFS({ name, content }),
    ...options,
  })
}
