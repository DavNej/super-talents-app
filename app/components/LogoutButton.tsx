'use client'

import React from 'react'

import { useParticleConnect } from '@particle-network/connect-react-ui'

export default function LogoutButton() {
  const { disconnect } = useParticleConnect()

  return (
    <button
      className='px-2 py-1 md:px-5 md:py-2 bg-pink rounded-md md:rounded-xl text-sm md:text-base'
      onClick={disconnect}>
      Logout
    </button>
  )
}
