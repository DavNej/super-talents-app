import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

import { useSmartAccount } from '@/features/smart-account'
import { log } from '@/utils'

import { talentLayerAddress, talentLayerInterface } from '../contract/config'
import { buildUpdateProfileDataTx } from '../contract/utils'

export default function useUpdateProfileData(
  options?: UseMutationOptions<
    string | null,
    unknown,
    {
      profileId: number
      cid: string
    }
  >
) {
  const { smartAccount, sendUserOp, signer } = useSmartAccount()

  return useMutation<
    string | null,
    unknown,
    {
      profileId: number
      cid: string
    }
  >({
    mutationFn: async ({ profileId, cid }) => {
      if (!smartAccount || !sendUserOp) {
        toast.warn('Smart account not ready yet')
        return null
      }
      if (!signer) {
        toast.error('No signer')
        return null
      }

      log('📓 | Update TL profile data')
      const contract = new ethers.Contract(
        talentLayerAddress,
        talentLayerInterface,
        signer
      )

      const tx = await buildUpdateProfileDataTx({ contract, profileId, cid })
      const txHash = await sendUserOp({ transactions: [tx] })
      log('📓 | TL profile data updated')
      return txHash
    },
    onError(err) {
      console.error(err)
      toast.error('Could not update profile data')
    },
    ...options,
  })
}
