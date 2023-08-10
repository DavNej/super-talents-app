import { CHAIN_NAMESPACES } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x13881', // hex of 80001, polygon testnet
  rpcTarget: 'https://rpc.ankr.com/polygon_mumbai',
  displayName: 'Polygon Mumbai Testnet',
  blockExplorer: 'https://mumbai.polygonscan.com/',
  ticker: 'MATIC',
  tickerName: 'Matic',
}

const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string

export const web3auth = new Web3AuthNoModal({
  clientId: WEB3AUTH_CLIENT_ID,
  chainConfig,
})

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const openloginAdapter = new OpenloginAdapter({
  privateKeyProvider,
})

web3auth.configureAdapter(openloginAdapter)

export type LoginProvider =
  | 'github'
  | 'google'
  | 'twitter'
  | 'linkedin'
  | 'email_passwordless'

export const loginProviders: {
  icon: string
  name: LoginProvider
}[] = [
  { icon: '/linkedin.svg', name: 'linkedin' },
  { icon: '/github.svg', name: 'github' },
  { icon: '/twitter.svg', name: 'twitter' },
  { icon: '/google.svg', name: 'google' },
]
