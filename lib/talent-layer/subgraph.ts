import axios from 'axios'
import { toast } from 'react-toastify'

import { log } from '@/lib/utils'
import type { IFetchTalentLayerUserParams, TalentLayerUserType } from './types'
import { validateTalentLayerUser } from './schemas'

const subgraphUrl =
  'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai'

export async function getTalentLayerUser({
  id,
  address,
  handle,
}: IFetchTalentLayerUserParams) {
  log('👤 | TL user')
  if (!Boolean(handle || address || id)) return null
  const query = buildUserGraphQuery({ id, address, handle })

  try {
    log('👤 | TL user hit')
    const res = await querSubgraph<{ users: TalentLayerUserType[] }>(query)
    const user = res.users.at(0)

    if (!user) {
      log('👤 | No user found', address || handle || id)
      return null
    }

    return validateTalentLayerUser(user)
  } catch (error) {
    console.log('Could not fetch TalentLayer user', { id, address, handle })
    throw error
  }
}

export async function profileIdOfHandle(handle: string) {
  const query = `
  {
    users(where: {handle: "${handle}"}, first: 1) {
      id
    }
  }
  `
  try {
    const res = await querSubgraph<{ users: TalentLayerUserType[] }>(query)
    const user = res.users.at(0)

    if (!user) return null
    if (user.id === undefined) return null

    return Number(user.id)
  } catch (err) {
    console.error(err)
    throw 'Could not check handle availability'
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
