'use client'

import React from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { ConnectButton } from '@/features/auth'

import { Button } from '@/app/components'
import { useSmartAccount } from '@/features/smart-account'

import { log } from '@/utils'

import {
  talentLayerAddress,
  talentLayerInterface,
} from '@/features/talent-layer/contract/config'
import { buildUpdateProfileDataTx } from '@/features/talent-layer/contract/utils'
import { useAccountInfo } from '@particle-network/connect-react-ui'

export default function ParticlePage() {
  const { smartAccount, sendUserOp, signer } = useSmartAccount()
  const { account } = useAccountInfo()

  const profileId = 273
  const cid = 'QmQRFzyoydweuo8uqoYZTT6YhmHyUcPjkzdev3EFQHuip8'

  const contract = new ethers.Contract(
    talentLayerAddress,
    talentLayerInterface,
    signer
  )

  const mut = useMutation({
    mutationFn: async () => {
      const tx = await buildUpdateProfileDataTx({ contract, profileId, cid })
      const txHash = await sendUserOp?.({ transactions: [tx] })

      console.log('🦋 | mutationFn: | txHash', txHash)

      return txHash
    },
  })

  return (
    <>
      <ConnectButton />
      <Button onClick={() => mut.mutate()}>Mint</Button>
      <h3>{JSON.stringify(mut.data, null, 2)}</h3>
    </>
  )
}
