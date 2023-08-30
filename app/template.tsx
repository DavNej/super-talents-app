'use client'

import React from 'react'

import { useInitAuth } from '@/lib/hooks'
import { PageLoader } from '@/app/components'

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const init = useInitAuth()

  if (init.isFetching) return <PageLoader />

  return children
}
