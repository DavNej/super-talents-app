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
  if (!Boolean(handle || address || id)) return null
  const query = buildUserGraphQuery({ id, address, handle })

  log('👤 | TL user')
  const res: { users: TalentLayerUserType[] } | null = await querSubgraph(query)
  const user = validateTalentLayerUser(res?.users?.at(0))

  if (!user) {
    log('👤 | No user found', address || handle || id)
  }

  return user
}

export async function profileIdOfHandle(handle: string) {
  const query = `
  {
    users(where: {handle: "${handle}"}, first: 1) {
      id
    }
  }
  `
  const res: { users: { id: string }[] } = await querSubgraph(query)
  const user = res.users.at(0)

  if (user?.id === undefined) return null

  return Number(user.id)
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

async function querSubgraph(query: string) {
  const res = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query,
    }),
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    console.error('💥', res.status, res.statusText)
    console.error('💥', await res.json())
    throw new Error('Could not query TL subgraph')
  }

  const response = await res.json()
  return response.data
}
