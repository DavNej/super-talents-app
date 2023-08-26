import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { toast } from 'react-toastify'

import { log } from '@/lib/utils'

import { urlFromCid } from './helpers'

const baseUrl = 'https://api.pinata.cloud/pinning'
const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`

export async function fetchFromIPFS<T>({ cid }: { cid: string }) {
  log('🪐 | Fetch from IPFS')
  if (!cid) return null
  log('🪐 | Fetch from IPFS hit')
  
  try {
    const res = await axios.get<T>(urlFromCid(cid))
    return res.data
  } catch (error) {
    toast.error('Could not fetch data from IPFS')
    throw error
  }
}

export async function uploadToIPFS({
  name,
  content,
}: {
  name: string
  content: unknown
}) {
  log('🪐 | Upload to IPFS hit')

  const axiosArgs = buildPinJsonArgs(content, name)

  try {
    const res = await axios.post<{ IpfsHash: string }>(...axiosArgs)
    return res.data.IpfsHash
  } catch (err) {
    toast.error('😣 Could not upload profile info')
    throw err
  }
}

function buildPinJsonArgs(
  content: unknown,
  name: string
): [string, string, AxiosRequestConfig] {
  const data = JSON.stringify({
    pinataOptions: { cidVersion: 0 },
    pinataMetadata: { name },
    pinataContent: content,
  })

  const headers = {
    'Content-Type': 'application/json',
    Authorization: JWT,
  }

  return [baseUrl + '/pinJSONToIPFS', data, { headers }]
}
