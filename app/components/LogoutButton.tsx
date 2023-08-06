'use client'

import { useWeb3Auth } from '@/lib/web3auth'

export default function LogoutButton() {
  const { logout, isConnected } = useWeb3Auth()

  if (!isConnected) return null

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
