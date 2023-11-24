import { toast } from 'react-toastify'
import { type UseMutationOptions, useMutation } from '@tanstack/react-query'

import { log } from '@/utils'
import api from '@/utils/api'

type ReturnedData = { profileId: number; txHash: string }
type MutationParams = { handle: string; address: string }

export default function useMintProfile(
  options?: UseMutationOptions<ReturnedData, unknown, MutationParams>
) {
  return useMutation<ReturnedData, unknown, MutationParams>({
    mutationFn: async ({ handle, address }) => {
      log('📓 | Mint profile')
      return api.POST('/api/mint-profile', { handle, address })
    },
    onError(err) {
      console.error('💥', err)
      toast.error('Could not mint Profile NFT')
    },
    ...options,
  })
}
