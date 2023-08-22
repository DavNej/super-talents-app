import { ethers } from 'ethers'
import { WALLET_ADAPTERS } from '@web3auth/base'

import { web3auth } from './config'
import { ILoginParams } from './types'

export async function web3authInit() {
  if (web3auth.status !== 'not_ready') return null
  await web3auth.init()
  return null
}

//TODO change getWeb3AuthSigner to getWeb3AuthProvider
//TODO return { provider, signer, signerAddress }
export async function getWeb3AuthSigner() {
  if (!web3auth.provider || web3auth.status !== 'connected') return null

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
  return null
}

export async function web3authLogout() {
  if (!(web3auth.status === 'connected')) return null
  await web3auth.logout()
  return null
}
