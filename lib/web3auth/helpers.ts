import { toast } from 'react-toastify'
import { ethers } from 'ethers'
import { WALLET_ADAPTERS } from '@web3auth/base'

import { log } from '@/lib/utils'

import type { Web3AuthLoginParams, IProvider } from './types'
import { web3auth } from './config'

export async function init() {
  log('🔑 | init')
  try {
    await web3auth.init()
    return web3auth.status
  } catch (err) {
    console.error(err)
    throw 'Auth initilization failed'
  }
}

export async function login({ loginProvider, email }: Web3AuthLoginParams) {
  log('🔑 | login')
  if (web3auth.connected) return null
  log('🔑 | login hit')
  const loginParams =
    loginProvider === 'email_passwordless'
      ? { loginProvider, extraLoginOptions: { login_hint: email } }
      : { loginProvider }

  await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, loginParams)
  return web3auth.status
}

export async function logout() {
  log('🔑 | logout')
  if (!web3auth.connected) return null
  log('🔑 | logout hit')
  await web3auth.logout()
  return web3auth.status
}

export async function getProvider() {
  log('🔑 | get-provider')
  if (!web3auth.provider || !web3auth.connected) return null
  log('🔑 | get-provider hit')
  try {
    const provider = new ethers.providers.Web3Provider(web3auth.provider)
    const signer = await provider.getSigner()
    const signerAddress = await signer.getAddress()
    return { provider, signer, signerAddress } as IProvider
  } catch (err) {
    console.error(err)
    throw 'Could not get provider'
  }
}
