import axios from 'axios'
import { toast } from 'react-toastify'
import type { IProfile, IProfileIPFS } from '@/app/hooks/profile/types'

const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'
// const IPFS_GATEWAY = 'https://gateway.ipfs.io/ipfs/'

export function urlFromCid(cid: string) {
  return IPFS_GATEWAY + cid
}

export function cidFromUrl(url: string) {
  return url.replace(IPFS_GATEWAY, '')
}

export async function getUserData({
  cid,
  handle,
}: {
  cid: string
  handle: string
}) {
  return cid
    ? axios
        .get<IProfileIPFS>(urlFromCid(cid))
        .then(res => {
          const profileData: IProfile = {
            ...res.data,
            handle,
          }
          return profileData
        })
        .catch(err => {
          console.error(err)
          toast.error('Could not fetch profile data')
          return null
        })
    : null
}
