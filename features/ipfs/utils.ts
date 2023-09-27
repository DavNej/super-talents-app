const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/' // or 'https://gateway.ipfs.io/ipfs/'

export function urlFromCid(cid: string) {
  return IPFS_GATEWAY + cid
}

export function cidFromUrl(url: string) {
  return url.replace(IPFS_GATEWAY, '')
}
