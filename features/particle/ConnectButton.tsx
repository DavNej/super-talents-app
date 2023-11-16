'use client'

import { ConnectButton } from '@particle-network/connect-react-ui'
import '@particle-network/connect-react-ui/dist/index.css'

import { Button } from '@/app/components'

export default function ParticleConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal }) => {
        return (
          <Button
            className='mt-5 w-full'
            onClick={openConnectModal}
            isDisabled={!!account}>
            Connect
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
