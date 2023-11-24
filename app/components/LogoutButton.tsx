'use client'

import React from 'react'
import { redirect } from 'next/navigation'

import { useAuth } from '@/features/auth'

export default function LogoutButton() {
  const { logout } = useAuth()

  if (logout?.isSuccess) {
    return redirect('/login')
  }

  return (
    <button
      className='px-2 py-1 md:px-5 md:py-2 bg-pink rounded-md md:rounded-xl text-sm md:text-base'
      onClick={() => logout?.mutate()}>
      Logout
    </button>
  )
}
