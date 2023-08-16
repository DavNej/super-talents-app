'use client'

import React from 'react'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import PageLoader from './PageLoader'

export default function AppRouter({ children }: { children: React.ReactNode }) {
  const { init, status } = useWeb3Auth()

  React.useEffect(() => {
    init()
  }, [init])

  if (status === 'not_ready') return <PageLoader />

  return children
}
