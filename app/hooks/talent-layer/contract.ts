import { ethers, type Signer, type ContractTransaction } from 'ethers'
import { toast } from 'react-toastify'
import React from 'react'

import { showErrorTransactionToast } from '@/lib/errors'
import { useUser } from '../user'
import { useBiconomy } from '../biconomy'

import { SUPERTALENTS_PLATFORM_ID, config, talentLayerAddress } from './config'
import talentLayerIdAbi from './TalentLayerID.json'
import { useWeb3Auth } from '../web3auth'

export const talentLayerInterface = new ethers.utils.Interface(talentLayerIdAbi)

export function buildMintTalentLayerIdTx({
  handle,
  handlePrice,
}: {
  handle: number
  handlePrice: number
}) {
  const txData = talentLayerInterface.encodeFunctionData('mint', [
    SUPERTALENTS_PLATFORM_ID,
    handle,
  ])

  return {
    to: talentLayerAddress,
    data: txData,
    value: handlePrice,
  }
}

export function buildUpdateProfileDataTx({
  id,
  cid,
}: {
  id: number
  cid: string
}) {
  const txData = talentLayerInterface.encodeFunctionData('updateProfileData', [
    id,
    cid,
  ])

  return {
    to: talentLayerAddress,
    data: txData,
  }
}

async function procressTransaction(
  caption: string,
  tx: ethers.ContractTransaction
) {
  console.log(`${caption} tx:`, tx)
  const rc = await tx.wait(1)
  console.log(`${caption} rc:`, rc)
}

export function useTalentLayerContract() {
  const { getConnectedUser } = useUser()
  const { signer } = useWeb3Auth()

  const biconomy = useBiconomy()

  React.useEffect(() => {
    if (signer) {
      biconomy.init(signer)
    }
  }, [biconomy, signer])

  if (!signer) return null

  const contract = new ethers.Contract(
    config.contracts.talentLayerId,
    talentLayerInterface,
    signer
  )

  // contract.on('Mint', async event => {
  //   console.log('✅ Minted', event)
  //   await getConnectedUser()
  // })

  // contract.on('CidUpdated', async event => {
  //   console.log('✅ Profile data updated', event)
  //   // await getConnectedUser()
  // })

  async function getHandlePrice({ handle }: { handle: string }) {
    try {
      const handlePrice: ethers.BigNumber = await contract.getHandlePrice(
        handle
      )
      return handlePrice
    } catch (error) {
      console.error(error)
      toast.error('Could not get handle price')
      return null
    }
  }

  async function mintTalentLayerId({ handle }: { handle: string }) {
    try {
      const handlePrice = await getHandlePrice({ handle })
      if (handlePrice === null) return

      const mintTx: ContractTransaction = await contract.mint(
        SUPERTALENTS_PLATFORM_ID,
        handle,
        { value: handlePrice }
      )

      await procressTransaction('🦋 | mint', mintTx)
    } catch (error) {
      toast.error('Could not mint Profile NFT')
      showErrorTransactionToast(error)
    }
  }

  async function updateProfileData({
    talentLayerId,
    newCid,
  }: {
    talentLayerId: number
    newCid: string
  }) {
    try {
      const updateDataTx: ContractTransaction =
        await contract.updateProfileData(talentLayerId, newCid)

      await procressTransaction('🦋 | updateProfileData', updateDataTx)
      toast.success('Profile data updated successfully')
    } catch (error) {
      toast.error('Could not update profile data')
      showErrorTransactionToast(error)
    }
  }

  return { getHandlePrice, mintTalentLayerId, updateProfileData }
}
