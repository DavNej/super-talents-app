'use client'

import React from 'react'

import { useAuth } from '@/lib/hooks'
import { PageLoader } from '@/app/components'

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useAuth()

  if (status === 'not_ready') return <PageLoader />

  return children
}
