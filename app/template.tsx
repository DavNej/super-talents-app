'use client'

import React from 'react'
import { redirect, usePathname } from 'next/navigation'

import { useAuth } from '@/lib/web3auth/hooks'
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

  if (init.isFetching) return <PageLoader />

  if (!provider && authenticatedRoutes.includes(pathname)) {
    return redirect('/login')
  }

  return children
}
