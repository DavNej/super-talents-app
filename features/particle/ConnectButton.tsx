import { ConnectButton } from '@particle-network/connect-react-ui'
import '@particle-network/connect-react-ui/dist/index.css'

import { Button } from '@/app/components'

export default function ParticleConnectButton() {
  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal }) => {
        return (
          <Button onClick={openConnectModal} isDisabled={!!account}>
            Connect
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
