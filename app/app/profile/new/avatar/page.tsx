'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

export default function AvatarPage() {
  const router = useRouter()

  const queryClient = useQueryClient()
  const signer = queryClient.getQueryData(['signer', 'connected'])

  console.log('🦋 | AvatarPage | signer', signer)

  React.useEffect(() => {
    if (!signer) {
      router.push('/app/login')
    }
  }, [router, signer])

  return <div>Create avatar</div>
}
