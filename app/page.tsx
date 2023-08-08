'use client'

import { useWeb3Auth } from '@/lib/web3auth'
import { useRouter } from 'next/navigation'
import React from 'react'
import Loader from './components/Loader'

export default function Init() {
  const { isConnected, init, isReady } = useWeb3Auth()
  const router = useRouter()

  React.useEffect(() => {
    init()
  }, [init])

  React.useEffect(() => {
    if (isReady) {
      router.push(isConnected ? '/profile/new/info' : '/login')
    }
  }, [isConnected, isReady, router])

  return (
    <main className='flex-1 flex items-center justify-center'>
      <Loader size={500} />
    </main>
  )
}
