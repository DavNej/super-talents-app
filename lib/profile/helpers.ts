import { log } from '@/lib/utils'
import { validateIPFSProfile } from './schemas'
import { fetchFromIPFS } from '../ipfs'

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
