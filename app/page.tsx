'use client'

import React from 'react'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import PageLoader from '@/app/components/PageLoader'
import { useRouter } from 'next/navigation'

export default function Init() {
  const { init, status } = useWeb3Auth()

  const router = useRouter()

  React.useEffect(() => {
    if (status === 'ready') return router.replace('/login')
    if (status === 'connected') return router.replace('/profile')
  }, [init, router, status])

  return <PageLoader />
}
