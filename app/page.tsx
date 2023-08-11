'use client'

import { useWeb3Auth } from '@/app/hooks/web3auth'
import { useRouter } from 'next/navigation'
import React from 'react'
import Loader from './components/Loader'

export default function Init() {
  const { init, status } = useWeb3Auth()
  const router = useRouter()

  React.useEffect(() => {
    init()
  }, [init])

  React.useEffect(() => {
    if (status === 'ready') {
      router.push('/login')
    }

    if (status === 'connected') {
      router.push('/profile/new/avatar')
    }
  }, [status, router])

  return (
    <main className='flex-1 flex items-center justify-center'>
      <Loader size={500} />
    </main>
  )
}
