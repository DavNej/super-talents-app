import Link from 'next/link'
import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import { type UseMutationOptions, useMutation } from '@tanstack/react-query'

import api from '@/utils/api'

type ReturnedData = { txHash: string }
type MutationParams = {
  handle: string
  address: string
  value: ethers.BigNumber
}
type Options = UseMutationOptions<ReturnedData, unknown, MutationParams>

export default function useMintProfile(options?: Options) {
  return useMutation<ReturnedData, unknown, MutationParams>({
    mutationFn: ({ handle, address, value }) =>
      api.POST<ReturnedData>('/api/mint-profile', { handle, address, value }),
    onSuccess({ txHash }, { handle }) {
      toast.success(
        <Link
          href={`https://mumbai.polygonscan.com/tx/${txHash}`}
          target='_blank'>
          Handle {handle} successfully minted 🎉
          <br />
          See transaction in explorer
        </Link>,
        { autoClose: false, closeOnClick: false }
      )
    },

    ...options,
  })
}
