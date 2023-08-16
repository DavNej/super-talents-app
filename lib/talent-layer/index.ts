import axios from 'axios'
import { ethers, type Signer, type ContractTransaction } from 'ethers'
import { toast } from 'react-toastify'

import { SUPERTALENTS_PLATFORM_ID, config } from './config'
import talentLayerIdAbi from './TalentLayerID.json'
import { showErrorTransactionToast } from '../errors'

export const talentLayerInterface = new ethers.utils.Interface(talentLayerIdAbi)

export interface ITalentLayerUser {
  address: string
  handle: string
  id: string
  cid?: string
}

type ITalentLayerResponse = {
  users: ITalentLayerUser[]
}

async function processRequest<T>(query: string): Promise<T | null> {
  try {
    const res = await axios.post<{ data: T }>(config.subgraphUrl, { query })
    return res.data.data
  } catch (error) {
    console.error(error)
    toast.error('Could not get talent data')
    return null
  }
}

export type IGetTalentLayerUserArgs = { handle?: string; address?: string }

export async function getTalentLayerUser({
  handle,
  address,
}: IGetTalentLayerUserArgs): Promise<ITalentLayerUser | null> {
  let whereClause = ''

  if (address) {
    whereClause = `{address: "${address?.toLowerCase()}"}`
  }

  if (handle) {
    whereClause = `{handle: "${handle}"}`
  }

  const query = `
    {
      users(where: ${whereClause}) {
        cid
        id
        handle
        address
      }
    }
    `

  const res = await processRequest<ITalentLayerResponse>(query)

  if (res === null) {
    toast.error('Couldn‘t query graph')
    return null
  }

  const user = res.users.at(0)

  if (user === undefined) {
    toast.error('No user registered with given address')
    return null
  }

  return user
}

export async function handleExists(handle: string): Promise<boolean | null> {
  const query = `
  {
    users(where: {handle: "${handle}"}, first: 1) {
      id
    }
  }
  `

  const res = await processRequest<ITalentLayerResponse>(query)

  if (!res) {
    toast.error('Could not check handle availability')
    return null
  }

  if (res.users.length > 0) return true

  return false
}

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
