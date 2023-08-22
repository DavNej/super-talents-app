'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { PageLoader } from '@/app/components'

export default function IndexPage() {
  const router = useRouter()

  React.useEffect(() => {
    router.push('/login')
  }, [router])

  return <PageLoader />
}
