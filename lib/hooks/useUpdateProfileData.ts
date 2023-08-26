import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'

import {
  talentLayerAddress,
  talentLayerInterface,
} from '@/lib/talent-layer/contract/config'
import { buildUpdateProfileDataTx } from '@/lib/talent-layer/contract/utils'
import { useAuth, useBiconomy } from '@/lib/hooks'
import { sendUserOp } from '@/lib/biconomy/helpers'
import { log } from '@/lib/utils'

export default function useUpdateProfileData(
  options?: UseMutationOptions<
    string | null,
    unknown,
    {
      profileId: BigInt
      cid: string
    }
  >
) {
  const { provider } = useAuth()
  const biconomy = useBiconomy()

  const signer = provider?.signer

  return useMutation<
    string | null,
    unknown,
    {
      profileId: BigInt
      cid: string
    }
  >({
    mutationFn: async ({ profileId, cid }) => {
      log('📓 | Update TL profile data')
      const smartAccount = biconomy.data.smartAccount
      if (!smartAccount) {
        toast.warn('Smart account not ready yet')
        return null
      }
      if (!signer) {
        toast.error('No signer')
        return null
      }

      log('📓 | Update TL profile data hit')
      const contract = new ethers.Contract(
        talentLayerAddress,
        talentLayerInterface,
        signer
      )
      const tx = await buildUpdateProfileDataTx({ contract, profileId, cid })
      const txHash = await sendUserOp({ smartAccount, transactions: [tx] })
      return txHash
    },
    onError(err) {
      console.error(err)
      toast.error('Could not update profile data')
    },
    ...options,
  })
}
