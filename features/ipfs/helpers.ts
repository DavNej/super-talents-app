import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

import { log } from '@/utils'
import { urlFromCid } from './utils'

const baseUrl = 'https://api.pinata.cloud/pinning'
const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`

export async function fetchFromIPFS<T>({ cid }: { cid: string }) {
  if (!cid) return null
  log('🪐 | Fetch from IPFS', cid)

  try {
    const res = await axios.get<T>(urlFromCid(cid))
    return res.data
  } catch (err) {
    console.error(err)
    throw 'Could not fetch data from IPFS'
  }
}

export async function uploadToIPFS({
  name,
  content,
}: {
  name: string
  content: unknown
}) {
  log('🪐 | Uploading to IPFS')
  log('🪐 | Name :', name)
  log('🪐 | Content :', content)

  const axiosArgs = buildPinJsonArgs(content, name)

  try {
    const res = await axios.post<{ IpfsHash: string }>(...axiosArgs)
    return res.data.IpfsHash
  } catch (err) {
    console.error(err)
    throw '😣 Could not upload profile info'
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
