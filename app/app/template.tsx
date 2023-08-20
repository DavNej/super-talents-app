'use client'

import { PageLoader } from '@/app/app/components'
import { useWeb3AuthInit } from '@/lib/web3auth/hooks'

import '@/app/globals.css'

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const web3AuthInit = useWeb3AuthInit()

  if (web3AuthInit.isLoading) return <PageLoader />

  return children
}
