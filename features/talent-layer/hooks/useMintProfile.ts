import { toast } from 'react-toastify'
import { type UseMutationOptions, useMutation } from '@tanstack/react-query'

import { log } from '@/utils'
import api from '@/utils/api'

export default function useMintProfile(
  options?: UseMutationOptions<
    { profileId: number },
    unknown,
    { handle: string; address: string }
  >
) {
  return useMutation<
    { profileId: number },
    unknown,
    { handle: string; address: string }
  >({
    mutationFn: async ({ handle, address }) => {
      log('📓 | Mint profile')
      return api.POST('/api/mint-profile', { handle, address })
    },
    onError(err) {
      console.error(err)
      toast.error('Could not mint Profile NFT')
    },
    ...options,
  })
}
