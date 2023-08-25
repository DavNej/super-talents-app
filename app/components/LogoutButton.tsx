'use client'

import React from 'react'

import { useAuth } from '@/lib/web3auth/hooks'

export default function LogoutButton() {
  const { logout } = useAuth()

  return (
    <button
      className='px-5 py-2 bg-pink rounded-xl'
      onClick={() => logout.mutate()}>
      Logout
    </button>
  )
}
