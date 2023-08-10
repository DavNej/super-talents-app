'use client'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import Toast from './Toast'
import React from 'react'

export default function LogoutButton() {
  const { logout, isConnected, error } = useWeb3Auth()
  const [errorMessage, setErrorMessage] = React.useState(error?.message || '')

  React.useEffect(() => {
    if (error) {
      setErrorMessage(error.message)
    }
  }, [error])

  if (!isConnected) return null

  return (
    <>
      <button
        className='px-5 py-2 bg-pink rounded-xl'
        onClick={async () => {
          await logout()
        }}>
        Logout
      </button>
      {errorMessage && (
        <Toast message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
    </>
  )
}
