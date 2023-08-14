import type { AddressLike } from 'ethers'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

import type { IProfileData } from '@/app/hooks/profile/types'

const baseUrl = 'https://api.pinata.cloud/pinning'
const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`

type Args = [string, FormData | string, AxiosRequestConfig]

function buildPinJsonArgs(
  profileData: IProfileData,
  ownerAddress: AddressLike
): Args {
  const data = JSON.stringify({
    pinataOptions: { cidVersion: 1 },
    pinataMetadata: { name: ownerAddress },
    pinataContent: profileData,
  })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: JWT,
  }

  return [baseUrl + '/pinJSONToIPFS', data, { headers }]
}

export function uploadToPinata(
  profileData: IProfileData,
  ownerAddress: AddressLike,
  callback: (ipfsHash: string) => void
) {
  const axiosArgs = buildPinJsonArgs(profileData, ownerAddress)

  axios.post(...axiosArgs).then(res => {
    callback(res.data.IpfsHash)
  })
}
