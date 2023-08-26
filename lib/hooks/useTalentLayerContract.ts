import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'

import api from '@/lib/api'
import { useAuth, useBiconomy } from '@/lib/hooks'
import { sendUserOp } from '@/lib/biconomy/helpers'

import {
  talentLayerAddress,
  talentLayerInterface,
} from '../talent-layer/contract/config'
import { buildUpdateProfileDataTx } from '../talent-layer/contract/utils'

export default function useTalentLayerContract() {
  const { provider } = useAuth()
  const biconomy = useBiconomy()

  const signer = provider?.signer

  const mintProfile = useMutation<
    { profileId: number },
    unknown,
    { handle: string; address: string }
  >({
    mutationFn: ({ handle, address }) =>
      api.POST('/api/mint-profile', { handle, address }),
    onError(err) {
      console.error(err)
      toast.error('Could not mint Profile NFT')
    },
  })

  const updateProfileData = useMutation<
    string | null,
    unknown,
    {
      id: number
      cid: string
    }
  >({
    mutationFn: async ({ id, cid }) => {
      const smartAccount = biconomy.data.smartAccount
      if (!smartAccount) {
        toast.warn('Smart account not ready yet')
        return null
      }
      if (!signer) {
        toast.error('No signer')
        return null
      }
      const contract = new ethers.Contract(
        talentLayerAddress,
        talentLayerInterface,
        signer
      )
      const tx = await buildUpdateProfileDataTx({ contract, id, cid })
      const txHash = await sendUserOp({ smartAccount, transactions: [tx] })
      return txHash
    },
    onError(err) {
      console.error(err)
      toast.error('Could not update profile data')
    },
  })

  return { mintProfile, updateProfileData }
}
