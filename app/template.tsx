'use client'

import React from 'react'

import { useWeb3AuthInit } from '@/lib/web3auth/hooks'
import { PageLoader } from '@/app/components'

// TODO remove /app from urls
export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const web3AuthInit = useWeb3AuthInit()

  if (web3AuthInit.isLoading) return <PageLoader />

  return children
}
