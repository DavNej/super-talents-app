'use client'
import React from 'react'
import { useAccount } from '@particle-network/connect-react-ui'

import { LogoutButton } from '@/app/components'

export default function Logout() {
  const account = useAccount()

  if (!account) return null

  return (
    <div className='flex justify-center mt-6 md:mt-8'>
      <LogoutButton />
    </div>
  )
}
