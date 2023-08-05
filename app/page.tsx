'use client'

import Image from 'next/image'

import { useWeb3Auth } from '@/lib/web3auth'
import { redirect } from 'next/navigation'
import React from 'react'

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
      <Image
        src='/loader.gif'
        alt='SuperTalents'
        width={500}
        height={500}
        priority
      />
    </main>
  )
}
