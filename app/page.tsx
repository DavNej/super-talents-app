'use client'

import React from 'react'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import PageLoader from '@/app/components/PageLoader'

export default function Init() {
  const { init, status } = useWeb3Auth()

  React.useEffect(() => {
    if (status === 'not_ready') {
      init()
    }
  }, [init, status])

  return <PageLoader />
}
