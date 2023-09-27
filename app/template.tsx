'use client'

import React from 'react'

import { PageLoader } from '@/app/components'
import { useAuth } from '@/features/auth'

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useAuth()

  if (status === 'not_ready') return <PageLoader />

  return children
}
