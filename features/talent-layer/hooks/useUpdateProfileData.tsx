import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

import { useSmartAccount } from '@/features/smart-account'
import { log } from '@/utils'

import { talentLayerAddress, talentLayerInterface } from '../contract/config'
import { buildUpdateProfileDataTx } from '../contract/utils'
import Link from 'next/link'

type ReturnedData = { txHash: string }
type MutationParams = { profileId: number; cid: string }
type Options = UseMutationOptions<ReturnedData, unknown, MutationParams>

const errorMessage = 'Could not update profile data'

export default function useUpdateProfileData(options?: Options) {
  const { smartAccount, sendUserOp, signer } = useSmartAccount()

  return useMutation<ReturnedData, unknown, MutationParams>({
    mutationFn: async ({ profileId, cid }) => {
      if (!smartAccount || !sendUserOp) {
        throw new Error(errorMessage, { cause: 'Smart account not ready yet' })
      }

      if (!signer) {
        throw new Error(errorMessage, { cause: 'No signer' })
      }

      log('🎫 | Updating TL profile data', { profileId, cid })

      const contract = new ethers.Contract(
        talentLayerAddress,
        talentLayerInterface,
        signer
      )

      const tx = await buildUpdateProfileDataTx({ contract, profileId, cid })

      const txHash = await sendUserOp({ transactions: [tx] })

      if (!txHash) {
        throw new Error(errorMessage, {
          cause: 'Tx did not go through. No transaction hash.',
        })
      }

      log('🎫 | TL profile data updated')
      return { txHash }
    },
    onSuccess({ txHash }) {
      toast.success(
        <Link
          href={`https://mumbai.polygonscan.com/tx/${txHash}`}
          target='_blank'>
          Profile data successfully updated 🎉
          <br />
          See transaction in explorer
        </Link>,
        { autoClose: 5000, closeOnClick: false }
      )
    },
    ...options,
  })
}
