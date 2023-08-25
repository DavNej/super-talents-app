'use client'

import React from 'react'
import { redirect, usePathname } from 'next/navigation'

import { useAuth, useConnectedUser } from '@/lib/hooks'
import { PageLoader } from '@/app/components'

// TODO check pathname regex pattern with zod
const authenticatedRoutes = [
  '/profile/new/avatar',
  '/profile/new/info',
  '/profile/new/preview',
]

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const { init, provider } = useAuth()
  const pathname = usePathname()

  const connectedUser = useConnectedUser()

  if (init.isFetching || connectedUser.isFetching) return <PageLoader />

  if (authenticatedRoutes.includes(pathname)) {
    if (!provider) {
      return redirect('/login')
    }

    if (connectedUser.data) {
      return redirect(`/profile/${connectedUser.data.handle}`)
    }
  }

  return children
}
