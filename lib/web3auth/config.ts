import { CHAIN_NAMESPACES } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3AuthNoModal } from '@web3auth/no-modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

const RPC_TARGET = process.env.NEXT_PUBLIC_RPC_TARGET as string
const WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string
const WEB3AUTH_NETWORK = process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK as
  | 'testnet'
  | 'mainnet'

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x13881', // hex of 80001, polygon testnet
  rpcTarget: RPC_TARGET,
  displayName: 'Polygon Mumbai Testnet',
  blockExplorer: 'https://mumbai.polygonscan.com/',
  ticker: 'MATIC',
  tickerName: 'Matic',
}

export const web3auth = new Web3AuthNoModal({
  clientId: WEB3AUTH_CLIENT_ID,
  chainConfig,
  web3AuthNetwork: WEB3AUTH_NETWORK,
})

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const openloginAdapter = new OpenloginAdapter({
  privateKeyProvider,
})

web3auth.configureAdapter(openloginAdapter)
