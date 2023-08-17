import { ethers, type Signer, type ContractTransaction } from 'ethers'
import { toast } from 'react-toastify'

import { SUPERTALENTS_PLATFORM_ID, config, talentLayerAddress } from './config'
import talentLayerIdAbi from './TalentLayerID.json'
import { showErrorTransactionToast } from '../errors'
import { getTalentLayerUser } from './graph'

export const talentLayerInterface = new ethers.utils.Interface(talentLayerIdAbi)
export async function mintTalentLayerId(
  handle: string,
  signer: Signer
): Promise<number | null> {
  try {
    const contract = new ethers.Contract(
      config.contracts.talentLayerId,
      talentLayerInterface,
      signer
    )

    const handlePrice: number = await contract.getHandlePrice(handle)
    const mintTx: ContractTransaction = await contract.mint(
      SUPERTALENTS_PLATFORM_ID,
      handle,
      { value: handlePrice }
    )

    console.log('🦋 | mintTx', mintTx)
    const mintRc = await mintTx.wait(1)
    console.log('🦋 | mintRc', mintRc)

    contract.on('Mint', (user, profileId, handle, platformId, fee, event) => {
      const info = {
        user,
        profileId,
        handle,
        platformId,
        fee,
        event,
      }

      console.log('Mint', info)
    })

    const address = await signer.getAddress()
    const talentLayerUser = await getTalentLayerUser({ address })

    if (!talentLayerUser) {
      return null
    }

    const talentLayerId = Number(talentLayerUser.id)
    if (Number.isNaN(talentLayerId) || !talentLayerId) {
      toast.error('Invalid profile Id')
      return null
    }

    return talentLayerId
  } catch (error) {
    toast.error('Could not mint Profile NFT')
    showErrorTransactionToast(error)
    return null
  }
}

export async function updateProfileData(
  talentLayerId: number,
  newCid: string,
  signer: Signer
) {
  try {
    const contract = new ethers.Contract(
      config.contracts.talentLayerId,
      talentLayerInterface,
      signer
    )

    contract.on('CidUpdated', (profileId, newCid, event) => {
      const info = {
        profileId,
        newCid,
        event,
      }

      console.log('CidUpdated', info)
    })

    const updateDataTx: ContractTransaction = await contract.updateProfileData(
      talentLayerId,
      newCid
    )
    const updateDataRc = await updateDataTx.wait(1)
    console.log('🦋 | updateDataRc', updateDataRc)
    toast.success('Profile data updated successfully')
  } catch (error) {
    toast.error('Could not update profile data')
    showErrorTransactionToast(error)
  }
}
