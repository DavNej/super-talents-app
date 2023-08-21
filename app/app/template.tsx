'use client'

import React from 'react'

import { useSigner, useWeb3AuthInit } from '@/lib/web3auth/hooks'
import { PageLoader } from '@/app/app/components'

import '@/app/globals.css'
import { useUser } from '@/features/profile/hooks'

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const web3AuthInit = useWeb3AuthInit()
  const signer = useSigner()
  const signerAddress = signer.data?.address
  const connectedUser = useUser({ address: signerAddress })

  if (web3AuthInit.isLoading || signer.isLoading || connectedUser.isLoading)
    return <PageLoader />

  return children
}
