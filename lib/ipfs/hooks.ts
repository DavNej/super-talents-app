import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'
import { useQuery, useMutation } from '@tanstack/react-query'

import { uploadToIPFS, fetchFromIPFS } from '.'

//TODO remove unecessary hooks
export function useGetFromIPFS(
  { cid }: { cid: string | undefined | null },
  options?: UseQueryOptions
) {
  return useQuery({
    queryKey: ['fetchFromIPFS', { cid }],
    queryFn: () => {
      if (!cid) {
        console.log('🦋 | fetchFromIPFS no CID provided', cid)
        return null
      }
      return fetchFromIPFS({ cid })
    },
    ...options,
  })
}

export function useUploadToIPFS(
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
