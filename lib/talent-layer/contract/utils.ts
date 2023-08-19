import { ethers } from 'ethers'
import type { Transaction } from '@biconomy/core-types'

import { talentLayerAddress, platfromId } from './config'

export async function buildMintProfileTx({
  contract,
  handle,
  handlePrice,
}: {
  contract: ethers.Contract
  handle: string
  handlePrice: ethers.BigNumber
}) {
  const mintTx = await contract.populateTransaction.mint(platfromId, handle)

  return {
    to: talentLayerAddress,
    data: mintTx.data,
    value: handlePrice,
  } as Transaction
}

export async function buildUpdateProfileDataTx({
  contract,
  id,
  cid,
}: {
  contract: ethers.Contract
  id: number
  cid: string
}) {
  const updateProfileDataTx =
    await contract.populateTransaction.updateProfileData(id, cid)

  return {
    to: talentLayerAddress,
    data: updateProfileDataTx.data,
  } as Transaction
}
