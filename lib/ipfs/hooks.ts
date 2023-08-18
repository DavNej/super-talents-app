import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useQuery, useMutation } from '@tanstack/react-query'

import { uploadToIPFS, fetchFromIPFS } from '.'

export function useGetFromIPFS<T>(
  { cid }: { cid: string },
  options?: UseQueryOptions<T>
) {
  return useQuery<T>({
    queryKey: ['fetchFromIPFS', { cid }],
    queryFn: () => fetchFromIPFS({ cid }),
    ...options,
  })
}

export function useUploadToIPFS<T>(
  options?: UseMutationOptions<string, unknown, { name: string; content: T }>
) {
  return useMutation<string, unknown, { name: string; content: T }>({
    mutationFn: ({ name, content }) => uploadToIPFS<T>({ name, content }),
    ...options,
  })
}
