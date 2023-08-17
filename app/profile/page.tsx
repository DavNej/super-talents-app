'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useUser } from '@/app/hooks/user'
import { useWeb3Auth } from '@/app/hooks/web3auth'

import PageLoader from '@/app/components/PageLoader'
import { getUserData } from '@/lib/ipfs'
import { useProfile } from '@/app/hooks/profile'

export default function ProfileRouterPage() {
  const { status } = useWeb3Auth()
  const { connectedUser } = useUser()

  const router = useRouter()
  const pathname = usePathname()

  const path =
    pathname === '/profile/new/info'
      ? '/profile/new/info'
      : '/profile/new/avatar'

  React.useEffect(() => {
    if (status !== 'connected') return router.replace('/login')
    if (connectedUser) return router.replace(`/profile/${connectedUser.handle}`)
    else router.replace(path)
  }, [connectedUser, path, router, status])

  return <PageLoader />
}
