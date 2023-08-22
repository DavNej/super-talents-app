'use client'

import React from 'react'

import { useWeb3AuthLogout } from '@/lib/web3auth/hooks'

export default function LogoutButton() {
  const logout = useWeb3AuthLogout()

  return (
    <button
      className='px-5 py-2 bg-pink rounded-xl'
      onClick={() => logout.mutate()}>
      Logout
    </button>
  )
}
