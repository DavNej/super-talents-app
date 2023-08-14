'use client'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import React from 'react'
import { toast } from 'react-toastify'

export default function LogoutButton() {
  const { logout, error, status } = useWeb3Auth()

  React.useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  if (!(status === 'connected')) return null

  return (
    <button
      className='px-5 py-2 bg-pink rounded-xl'
      onClick={async () => {
        await logout()
      }}>
      Logout
    </button>
  )
}
