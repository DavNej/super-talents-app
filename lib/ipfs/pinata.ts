import type { AddressLike } from 'ethers'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { toast } from 'react-toastify'

import type { IProfileIPFS } from '@/app/hooks/profile/types'

const baseUrl = 'https://api.pinata.cloud/pinning'
const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`

type Args = [string, string, AxiosRequestConfig]

export async function uploadToPinata(
  profileData: IProfileIPFS,
  ownerAddress: AddressLike
): Promise<string | null> {
  const axiosArgs = buildPinJsonArgs(profileData, ownerAddress)

  try {
    const res = await axios.post<{ IpfsHash: string }>(...axiosArgs)
    return res.data.IpfsHash
  } catch (err) {
    console.error(err)
    toast.error('Could not upload profile info')
    return null
  }
}

function buildPinJsonArgs(
  profileData: IProfileIPFS,
  ownerAddress: AddressLike
): Args {
  const data = JSON.stringify({
    pinataOptions: { cidVersion: 0 },
    pinataMetadata: { name: ownerAddress },
    pinataContent: profileData,
  })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: JWT,
  }

  return [baseUrl + '/pinJSONToIPFS', data, { headers }]
}
