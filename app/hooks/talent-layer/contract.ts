import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import React from 'react'
import type { Transaction } from '@biconomy/core-types'

import { showErrorTransactionToast } from '@/lib/errors'
import { useBiconomy } from '../biconomy'

import { SUPERTALENTS_PLATFORM_ID, config, talentLayerAddress } from './config'
import talentLayerIdAbi from './TalentLayerID.json'
import { useWeb3Auth } from '../web3auth'
import { getTalentLayerUser } from './graph'

export const talentLayerInterface = new ethers.utils.Interface(talentLayerIdAbi)

export function buildMintTalentLayerIdTx({
  handle,
  handlePrice,
}: {
  handle: string
  handlePrice: ethers.BigNumber
}): Transaction {
  const functionData = talentLayerInterface.encodeFunctionData('mint', [
    SUPERTALENTS_PLATFORM_ID,
    handle,
  ])

  return {
    to: talentLayerAddress,
    data: functionData,
    value: handlePrice,
  }
}

export function buildUpdateProfileDataTx({
  id,
  cid,
}: {
  id: number
  cid: string
}): Transaction {
  const functionData = talentLayerInterface.encodeFunctionData(
    'updateProfileData',
    [id, cid]
  )

  return {
    to: talentLayerAddress,
    data: functionData,
  }
}

export function useTalentLayerContract() {
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

      const tx = buildMintTalentLayerIdTx({ handle, handlePrice })
      console.log('🦋 | mintTalentLayerId', { tx })
      await biconomy.sendUserOp([tx])
    } catch (error) {
      toast.error('Could not mint Profile NFT')
      showErrorTransactionToast(error)
    }
  }

  async function updateProfileData({
    handle,
    talentLayerId,
    newCid,
  }: {
    handle?: string
    talentLayerId?: number
    newCid?: string
  }) {
    try {
      let _id = talentLayerId
      let _cid = newCid

      if (handle) {
        const _user = await getTalentLayerUser({ handle })
        if (_user) {
          _id = Number(_user.id)
          _cid = _user.cid
        }
      }

      if (!(_id && _cid)) {
        toast.warn('Missing id or cid')
        return
      }

      const tx = buildUpdateProfileDataTx({ id: _id, cid: _cid })

      console.log('🦋 | updateProfileData', { tx })
      await biconomy.sendUserOp([tx])
    } catch (error) {
      toast.error('Could not update profile data')
      showErrorTransactionToast(error)
    }
  }

  return { getHandlePrice, mintTalentLayerId, updateProfileData }
}
