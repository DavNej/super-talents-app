import axios from 'axios'
import { toast } from 'react-toastify'

import { type ITalentLayerUser, config } from './config'

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
    console.log('No user registered with given address')
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
