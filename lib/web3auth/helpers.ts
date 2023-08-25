import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import { WALLET_ADAPTERS } from '@web3auth/base'

import { log } from '@/lib/utils'

import { Web3AuthLoginParams } from './types'
import { web3auth } from './config'

type IProvider = {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
  signerAddress: string
}

export async function init() {
  log('🍇 | init')
  try {
    await web3auth.init()
    if (web3auth.connected) {
      const provider = await getProvider()
      return provider
    }
  } catch (err) {
    toast.error('Auth initilization failed')
    throw err
  }
  return null
}

export async function getProvider() {
  log('🍇 | get-provider', !web3auth.provider || !web3auth.connected)
  if (!web3auth.provider || !web3auth.connected) return null
  try {
    const provider = new ethers.providers.Web3Provider(web3auth.provider)
    const signer = await provider.getSigner()
    const signerAddress = await signer.getAddress()
    return { provider, signer, signerAddress } as IProvider
  } catch (err) {
    toast.error('Could not get provider')
    console.error('Could not get provider')
    return null
  }
}

export async function login({ loginProvider, email }: Web3AuthLoginParams) {
  log('🍇 | login')
  const loginParams =
    loginProvider === 'email_passwordless'
      ? { loginProvider, extraLoginOptions: { login_hint: email } }
      : { loginProvider }

  await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, loginParams)
  const provider = await getProvider()
  return provider
}

export async function logout() {
  log('🍇 | logout')
  if (!web3auth.connected) return null
  await web3auth.logout()
  return null
}
