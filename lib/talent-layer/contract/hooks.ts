import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useBiconomy } from '@/lib/biconomy/hooks'

import { talentLayerAddress, talentLayerInterface } from './config'
import { buildMintProfileTx, buildUpdateProfileDataTx } from './utils'

export function useTalentLayerContract({
  signer,
}: {
  signer: ethers.providers.JsonRpcSigner
}) {
  const { userOp } = useBiconomy({ signer })

  const contract = new ethers.Contract(
    talentLayerAddress,
    talentLayerInterface,
    signer
  )

  async function getHandlePrice({ handle }: { handle: string }) {
    try {
      const handlePrice: ethers.BigNumber = await contract.getHandlePrice(
        handle
      )
      return handlePrice
    } catch (err) {
      toast.error('Could not get handle price')
      throw err
    }
  }

  async function mintProfile({ handle }: { handle: string }) {
    const handlePrice = await getHandlePrice({ handle })
    try {
      const tx = await buildMintProfileTx({
        contract,
        handle,
        handlePrice,
      })
      userOp.mutate({ transactions: [tx] })
    } catch (err) {
      toast.error('Could not mint Profile NFT')
      throw err
    }
  }

  async function updateProfileData({
    id,
    newCid,
  }: {
    id: number
    newCid: string
  }) {
    try {
      const tx = await buildUpdateProfileDataTx({ contract, id, cid: newCid })
      userOp.mutate({ transactions: [tx] })
    } catch (err) {
      toast.error('Could not update profile data')
      throw err
    }
  }

  return { mintProfile, updateProfileData }
}
