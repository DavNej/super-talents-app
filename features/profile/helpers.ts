import { fetchFromIPFS } from '@/features/ipfs/helpers'
import { log } from '@/utils'

import { validateIPFSProfile } from './schemas'

export const roleCaptions = {
  seller: 'Talent',
  buyer: 'Client',
  both: 'Both',
}

export async function getProfileData(cid: string | undefined) {
  if (!cid) return null
  log('📖 | Profile data')

  const data = await fetchFromIPFS({ cid })
  return validateIPFSProfile(data)
}
