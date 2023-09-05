'use client'
import React from 'react'

import { LogoutButton } from '@/app/components'
import { useAuth } from '@/lib/hooks'

export default function Logout() {
  const { provider } = useAuth()

  if (!provider.data?.provider) {
    return null
  }

  return (
    <div className='flex justify-center mt-8'>
      <LogoutButton />
    </div>
  )
}
