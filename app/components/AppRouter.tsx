'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import { useUser } from '@/app/hooks/user'

export default function AppRouter({ children }: { children: React.ReactNode }) {
  const { status } = useWeb3Auth()
  const { user, isFetched: userIsFetched } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (status === 'connected') router.replace('/profile')
    if (status === 'ready') router.replace('/login')
    if (status === 'not_ready') router.replace('/')
  }, [status, router, user, userIsFetched])

  return children
}
