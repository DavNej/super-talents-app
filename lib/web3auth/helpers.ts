import { ethers } from 'ethers'

import { web3auth } from './config'

export async function web3authInit() {
  await web3auth.init()

  const signer = await getSigner()
  return signer
}

export async function getSigner() {
  if (web3auth.status !== 'connected') return
  if (!web3auth.provider) return

  const provider = new ethers.providers.Web3Provider(web3auth.provider)
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  return { signer, address }
}
