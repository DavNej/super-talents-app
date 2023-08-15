'use client'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import React from 'react'
import { clsx, type ClassValue } from 'clsx'

export default function LogoutButton({
  className,
}: {
  className?: ClassValue
}) {
  const { logout, status } = useWeb3Auth()

  if (!(status === 'connected')) return null

  return (
    <button
      className={clsx('px-5 py-2 bg-pink rounded-xl', className)}
      onClick={async () => {
        await logout()
      }}>
      Logout
    </button>
  )
}
