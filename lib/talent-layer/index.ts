import axios from 'axios'
import { Interface, ethers } from 'ethers'
import { toast } from 'react-toastify'

import { SUPERTALENTS_PLATFORM_ID, config } from './config'
import TalentLayerIdAbi from './TalentLayerID.json'

interface ITalentLayerUser {
  id: string
  cid?: string
  handle?: string
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
    return null
  }
}

export async function getTalentLayerUser(
  address: string
): Promise<ITalentLayerUser | null> {
  const query = `
    {
      users(where: {address: "${address}"}) {
        cid
        id
        handle
      }
    }
    `

  const res = await processRequest<ITalentLayerResponse>(query)

  if (res === null) {
    toast.error('Something went wrong')
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
    users(where: {handle_contains_nocase: "${handle}"}, first: 1) {
      id
    }
  }
  `

  const res = await processRequest<ITalentLayerResponse>(query)

  if (res === null) {
    toast.error('Could not check handle availability')
    return null
  }

  if (res.users.length > 0) return true

  return false
}

export async function mintTalentLayerId(handle: string, signer: ethers.Signer) {
  try {
    const abi = new Interface(TalentLayerIdAbi)

    const contract = new ethers.Contract(
      config.contracts.talentLayerId,
      abi,
      signer
    )

    const talentLayerId: number = await contract.mint(
      SUPERTALENTS_PLATFORM_ID,
      handle
    )
    console.log('🦋 | mintTalentLayerId | talentLayerId', talentLayerId)
    return talentLayerId
  } catch (error) {
    console.error(error)
    toast.error('Could not mint Profile NFT')
    return null
  }
}

export async function updateProfileData(
  talentLayerId: number,
  newCid: string,
  signer: ethers.Signer
) {
  try {
    const abi = new Interface(TalentLayerIdAbi)

    const contract = new ethers.Contract(
      config.contracts.talentLayerId,
      abi,
      signer
    )

    const updateDataRes = await contract.updateData(talentLayerId, newCid)
    toast.success('Profile data updated successfully')
    console.log('🦋 | updateDataRes', updateDataRes)
  } catch (error) {
    console.error(error)
    toast.error('Could not update profile data')
  }
}
