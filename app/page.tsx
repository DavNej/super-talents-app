'use client'

import { useWeb3Auth } from '@/lib/web3auth'
import { redirect } from 'next/navigation'
import React from 'react'
import Loader from './components/Loader'

export default function Init() {
  const { isConnected, init, isReady } = useWeb3Auth()

  React.useEffect(() => {
    init()
  }, [init])

  React.useEffect(() => {
    if (isReady) {
      redirect(isConnected ? '/profile/address' : '/login')
    }
  }, [isConnected, isReady])

  return (
    <main className='flex-1 flex items-center justify-center'>
      <Loader size={500} />
    </main>
  )
}
