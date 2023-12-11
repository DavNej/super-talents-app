import { ethers } from 'ethers'
import type { Transaction } from '@biconomy/core-types'

import { talentLayerAddress, platfromId } from './config'
import { ProfileIdType } from '../types'

export async function buildMintProfileTx({
  contract,
  handle,
  handlePrice,
}: {
  contract: ethers.Contract
  handle: string
  handlePrice: ethers.BigNumber
}): Promise<Transaction> {
  const mintTx = await contract.populateTransaction.mint(platfromId, handle)

  return {
    to: talentLayerAddress,
    data: mintTx.data,
    value: handlePrice,
  }
}

export async function buildUpdateProfileDataTx({
  contract,
  profileId,
  cid,
}: {
  contract: ethers.Contract
  profileId: ProfileIdType
  cid: string
}): Promise<Transaction> {
  const updateProfileDataTx =
    await contract.populateTransaction.updateProfileData(profileId, cid)

  return {
    to: talentLayerAddress,
    data: updateProfileDataTx.data,
  }
}
