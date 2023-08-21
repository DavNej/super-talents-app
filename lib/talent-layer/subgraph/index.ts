import axios from 'axios'
import { toast } from 'react-toastify'

import type { IFetchTalentLayerUserParams, TalentLayerUserType } from '../types'

const subgraphUrl =
  'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai'

export async function getTalentLayerUser({
  id,
  address,
  handle,
}: IFetchTalentLayerUserParams) {
  if (!Boolean(handle || address || id)) return null
  const query = buildUserGraphQuery({ id, address, handle })

  try {
    const res = await querSubgraph<{ users: TalentLayerUserType[] }>(query)
    const user = res.users.at(0)
    if (!user) {
      console.log('🤷 No TalentLayer user found', { id, address, handle })
      return null
    }
    return user
  } catch (error) {
    console.log('Could not fetch TalentLayer user', { id, address, handle })
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
    const res = await querSubgraph<{ users: TalentLayerUserType[] }>(query)
    return Boolean(res.users.length > 0)
  } catch (err) {
    toast.error('Could not check handle availability')
    throw err
  }
}

function buildUserGraphQuery({
  id,
  address,
  handle,
}: IFetchTalentLayerUserParams) {
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
    const res = await axios.post<{ data: T }>(subgraphUrl, { query })
    return res.data.data
  } catch (error) {
    toast.error('Could not query subgraph')
    throw error
  }
}
