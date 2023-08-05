'use client'

import { useWeb3Auth } from '@/lib/web3auth'

export default function LogoutButton() {
  const { logout, isConnected } = useWeb3Auth()

  if (!isConnected) return null

  return (
    <button
      className='bg-pink rounded-sm'
      onClick={async () => {
        await logout()
      }}>
      Logout
    </button>
  )
}
