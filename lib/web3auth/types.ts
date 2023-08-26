import { ethers } from 'ethers'

export type LoginProvider =
  | 'github'
  | 'google'
  | 'twitter'
  | 'linkedin'
  | 'email_passwordless'

export interface Web3AuthLoginParams {
  loginProvider: LoginProvider
  email?: string
}

export type IProvider = {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
  signerAddress: string
}
