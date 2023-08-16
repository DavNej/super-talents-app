'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useUser } from '@/app/hooks/user'
import { useWeb3Auth } from '@/app/hooks/web3auth'

import PageLoader from '@/app/components/PageLoader'

export default function ProfileRouterPage() {
  const { status } = useWeb3Auth()
  const { user, isFetched: userIsFetched } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  
  React.useEffect(() => {
    if (userIsFetched) {
      if (user) {
        router.replace(`/profile/${user.handle}`)
      } else {
        router.replace(
          pathname === '/profile/new/info'
            ? '/profile/new/info'
            : '/profile/new/avatar'
        )
      }
    }
  }, [pathname, router, status, user, userIsFetched])

  return <PageLoader />
}
