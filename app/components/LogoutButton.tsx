'use client'

import React from 'react'
import { redirect } from 'next/navigation'

import {
  useAccount,
  useParticleConnect,
} from '@particle-network/connect-react-ui'

export default function LogoutButton() {
  const { disconnect } = useParticleConnect()
  const account = useAccount()

  if (!account) {
    return redirect('/')
  }

  return (
    <button className='px-5 py-2 bg-pink rounded-xl' onClick={disconnect}>
      Logout
    </button>
  )
}
