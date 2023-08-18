import { ethers } from 'ethers'
import { WALLET_ADAPTERS } from '@web3auth/base'

import { web3auth } from './config'
import { ILoginParams } from './types'

export async function web3authInit() {
  await web3auth.init()

  if (web3auth.status === 'connected') {
    const signer = await getWeb3AuthSigner()
    return signer
  }

  return null
}

export async function getWeb3AuthSigner() {
  if (web3auth.status !== 'connected') return null
  if (!web3auth.provider) return null

  const provider = new ethers.providers.Web3Provider(web3auth.provider)
  const signer = await provider.getSigner()
  const address = await signer.getAddress()

  return { signer, address }
}

export async function web3authLogin({ loginProvider, email }: ILoginParams) {
  const loginParams =
    loginProvider === 'email_passwordless'
      ? { loginProvider, extraLoginOptions: { login_hint: email } }
      : { loginProvider }

  await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, loginParams)
  const signer = await getWeb3AuthSigner()
  return signer
}

export async function web3authLogout() {
  if (!(web3auth.status === 'connected')) return null
  await web3auth.logout()
  return null
}
