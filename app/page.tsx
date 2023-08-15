'use client'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import { useRouter } from 'next/navigation'
import React from 'react'
import PageLoader from './components/PageLoader'
import { useUser } from './hooks/user'

export default function Init() {
  const { init, status } = useWeb3Auth()
  const user = useUser()
  const router = useRouter()

  React.useEffect(() => {
    init()
  }, [init])

  React.useEffect(() => {
    if (status === 'ready') {
      router.push('/login')
    }

    if (status === 'connected') {
      if (user.id) {
        router.push('/profile')
      } else {
        router.push('/profile/new/avatar')
      }
    }
  }, [status, router, user])

  return <PageLoader />
}
