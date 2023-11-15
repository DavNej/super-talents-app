'use client'

import { ModalProvider } from '@particle-network/connect-react-ui'
import { PolygonMumbai } from '@particle-network/chains'
import { evmWallets } from '@particle-network/connect'

const PARTICLE_PROJECT_ID = process.env
  .NEXT_PUBLIC_PARTICLE_NETWORK_PROJECT_ID as string
const PARTICLE_CLIENT_KEY = process.env
  .NEXT_PUBLIC_PARTICLE_NETWORK_CLIENT_KEY as string
const PARTICLE_APP_ID = process.env
  .NEXT_PUBLIC_PARTICLE_NETWORK_APP_ID as string
const WALLET_CONNECT_PROJECT_ID = process.env
  .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string

export default function ParticleProvider({
  children,
}: React.PropsWithChildren) {
  return (
    <ModalProvider
      options={{
        projectId: PARTICLE_PROJECT_ID,
        clientKey: PARTICLE_CLIENT_KEY,
        appId: PARTICLE_APP_ID,
        chains: [PolygonMumbai],
        wallets: evmWallets({
          projectId: WALLET_CONNECT_PROJECT_ID,
          showQrModal: false,
        }),
      }}
      theme='dark'
      language='en'
      walletSort={['Particle Auth', 'Wallet']}
      particleAuthSort={[
        'email',
        'phone',
        'google',
        'linkedin',
        'github',
        'twitter',
        'discord',
        'twitch',
        'facebook',
        'apple',
        'microsoft',
      ]}>
      {children}
    </ModalProvider>
  )
}
