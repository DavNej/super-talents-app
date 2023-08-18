import axios from 'axios'
import { toast } from 'react-toastify'

import { config } from './config'
import type { IFetchUserParams, ITalentLayerUser } from './types'

export async function getTalentLayerUser({
  id,
  address,
  handle,
}: IFetchUserParams) {
  const query = buildUserGraphQuery({ id, address, handle })

  try {
    const res = await querSubgraph<{ users: ITalentLayerUser[] }>(query)
    return res.users.at(0)
  } catch (error) {
    console.log('🤷 No talent user found', { id, address, handle })
    throw error
  }
}

export async function handleExists(handle: string) {
  const query = `
  {
    users(where: {handle: "${handle}"}, first: 1) {
      id
    }
  }
  `
  try {
    const res = await querSubgraph<{ users: ITalentLayerUser[] }>(query)
    return Boolean(res.users.length > 0)
  } catch (err) {
    toast.error('Could not check handle availability')
    throw err
  }
}

function buildUserGraphQuery({ id, address, handle }: IFetchUserParams) {
  let whereClause = ''

  if (handle) {
    whereClause = `{handle: "${handle}"}`
  } else if (id) {
    whereClause = `{id: ${id}}`
  } else if (address) {
    whereClause = `{address: "${address?.toLowerCase()}"}`
  }

  return `
    {
      users(where: ${whereClause}) {
        cid
        id
        handle
        address
      }
    }
    `
}

async function querSubgraph<T>(query: string) {
  try {
    const res = await axios.post<{ data: T }>(config.subgraphUrl, { query })
    return res.data.data
  } catch (error) {
    toast.error('Could not query subgraph')
    throw error
  }
}
