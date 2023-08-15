'use client'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import React from 'react'
import { toast } from 'react-toastify'
import { clsx, type ClassValue } from 'clsx'

export default function LogoutButton({
  className,
}: {
  className?: ClassValue
}) {
  const { logout, error, status } = useWeb3Auth()

  React.useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

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
